import { readProfile } from "./profile";
// Client for the AfriCareer AI FastAPI backend.
// Set NEXT_PUBLIC_API_URL in Vercel (and .env.local) to the Render URL.
const API = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

function recordRequest(path, event, elapsed, language) {
  if (path === "/feedback") return;
  const user = readProfile();
  if (!user?.analytics) return;
  logEvent({ event, user_name: user.participantId, country: user.country, language: language || "English", details: JSON.stringify({ version: "pilot-v2", tool: path, duration_ms: elapsed }) });
}

async function request(path, options = {}) {
  const started = Date.now();
  const language = typeof options.body === "string" ? JSON.parse(options.body).language : "English";
  const controller = new AbortController();
  // Doctoral drafts include a separate factual review and may need one revision.
  const timeoutMs = ["/application-draft", "/motivation-letter"].includes(path) ? 260000 : 120000;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${API}${path}`, { ...options, signal: controller.signal });
    if (!res.ok) {
      if (res.status === 409) {
        const data = await res.json();
        throw new Error(data.detail || "The draft could not pass factual checks. Please retry.");
      }
      const messages = { 413: "This file is too large. Choose a file under 5 MB.", 429: "You have made several requests. Please wait a minute and try again.", 422: "Please check the required fields and shorten very long entries.", 401: "The service requires access authorization. Please contact the pilot team.", 503: "The service is temporarily unavailable. Please try again shortly." };
      throw new Error(messages[res.status] || "The request could not be completed. Please try again.");
    }
    recordRequest(path, "request_completed", Date.now() - started, language);
    return res;
  } catch (error) {
    recordRequest(path, "request_failed", Date.now() - started);
    if (error.name === "AbortError") throw new Error("This request took too long. Please try again shortly.");
    if (error instanceof TypeError) throw new Error("Could not reach AfriCareer. Check your connection and try again.");
    throw error;
  } finally { clearTimeout(timeout); }
}

async function postJSON(path, body) {
  const res = await request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

async function postForDocx(path, body, filename) {
  const res = await request(path, {
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
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function uploadFile(path, file) {
  if (!/\.(pdf|docx|txt)$/i.test(file.name)) throw new Error("Choose a PDF, DOCX or TXT file.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Choose a file under 5 MB.");
  if (!file.size) throw new Error("This file is empty.");
  const fd = new FormData();
  fd.append("file", file);
  const res = await request(path, { method: "POST", body: fd });
  if (!res.ok) throw new Error(`Upload failed (${res.status})`);
  return res.json();
}

// Fire-and-forget analytics event (never blocks the UI).
function logEvent(body) {
  if (!readProfile()?.analytics) return;
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

// Feedback is acknowledged by the server; never report a failed write as saved.
async function logFeedback(body) { return postJSON("/feedback", body); }

export const api = {
  event: logEvent,
  feedback: logFeedback,
  adminMetrics,
  knowledge: () => request('/knowledge').then(r=>r.json()),
  cvDraft: body => postJSON('/cv/draft', body),
  cvDocument: body => postForDocx('/cv/document', body, 'AfriCareer_Reviewed_CV.docx'),
  applicationDraft: body => postJSON('/application-draft', body),
  applicationDocument: body => postForDocx('/application-document', body, 'AfriCareer_Application_Draft.docx'),
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
