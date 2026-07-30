// Client for the AfriCareer AI FastAPI backend.
// Set NEXT_PUBLIC_API_URL in Vercel (and .env.local) to the Render URL.
const API = process.env.NEXT_PUBLIC_API_URL || "";

async function postJSON(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

async function postForDocx(path, body, filename) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function uploadFile(path, file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${API}${path}`, { method: "POST", body: fd });
  if (!res.ok) throw new Error(`Upload failed (${res.status})`);
  return res.json();
}

// Fire-and-forget analytics event (never blocks the UI).
function logEvent(body) {
  try {
    fetch(`${API}/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

// Admin usage dashboard (token entered at runtime; never stored in the bundle).
async function adminMetrics(token) {
  const res = await fetch(`${API}/admin/metrics`, {
    headers: { "X-Admin-Token": token },
    cache: "no-store",
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error("Invalid admin token");
    if (res.status === 503) throw new Error("Admin not configured on the server (set ADMIN_TOKEN on Render)");
    throw new Error(`Request failed (${res.status})`);
  }
  return res.json();
}

export const api = {
  event: logEvent,
  adminMetrics,
  assistant: (question, language = "English") => postJSON("/assistant", { question, language }),
  careerGuidance: (answers, language = "English") => postJSON("/career-guidance", { answers, language }),
  jobs: (body) => postJSON("/jobs", body),
  courses: (body) => postJSON("/courses", body),
  opportunities: (body) => postJSON("/opportunities", body),
  analyzeResume: (body) => postJSON("/analyze-resume", body),
  extractText: (file) => uploadFile("/extract-text", file),
  cvFromAnswers: (body) => postForDocx("/cv/from-answers", body, "AfriCareer_CV.docx"),
  cvFromResume: (body) => postForDocx("/cv/from-resume", body, "AfriCareer_CV.docx"),
  coverLetter: (body) => postForDocx("/cover-letter", body, "AfriCareer_CoverLetter.docx"),
  motivationLetter: (body) => postForDocx("/motivation-letter", body, "AfriCareer_Motivation_Letter.docx"),
};
