"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "../../lib/api";

const GROUPS = [
  ["Career", [
    ["assistant", "AI Assistant"],
    ["guidance", "Career Guidance"],
    ["cv", "CV Builder"],
    ["cover", "Cover Letter"],
    ["jobs", "Job Search"],
  ]],
  ["Academic", [
    ["motivation", "Motivation Letters"],
    ["opportunities", "Scholarships & Opportunities"],
  ]],
  ["Grow", [
    ["learning", "Learning Resources"],
  ]],
];
const LABEL = Object.fromEntries(GROUPS.flatMap(([, items]) => items));

export default function AppPage() {
  const [tool, setTool] = useState("assistant");
  return (
    <div className="min-h-screen bg-slate-50/50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-extrabold tracking-tight text-slate-900">
            AfriCareer <span className="text-[var(--brand)]">AI</span>
          </Link>
          <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900">← Home</Link>
        </div>
      </header>

      {/* Mobile tool picker */}
      <div className="border-b border-slate-200 bg-white px-4 py-3 md:hidden">
        <div className="flex gap-2 overflow-x-auto">
          {GROUPS.flatMap(([, items]) => items).map(([k, l]) => (
            <button key={k} onClick={() => setTool(k)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium ${tool === k ? "bg-[var(--brand)] text-white" : "bg-slate-100 text-slate-600"}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl gap-8 px-6 py-8">
        {/* Sidebar */}
        <aside className="hidden w-60 shrink-0 md:block">
          <nav className="sticky top-24 space-y-6">
            {GROUPS.map(([group, items]) => (
              <div key={group}>
                <div className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{group}</div>
                <div className="mt-2 space-y-1">
                  {items.map(([k, l]) => (
                    <button key={k} onClick={() => setTool(k)}
                      className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${tool === k ? "bg-blue-50 text-[var(--brand)]" : "text-slate-600 hover:bg-slate-100"}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-2xl">
            {tool === "assistant" && <Assistant />}
            {tool === "guidance" && <Guidance />}
            {tool === "cv" && <CvBuilder />}
            {tool === "cover" && <CoverLetter />}
            {tool === "jobs" && <Jobs />}
            {tool === "motivation" && <Motivation />}
            {tool === "opportunities" && <Opportunities />}
            {tool === "learning" && <Learning />}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ---------- shared UI ---------- */
function Head({ title, desc }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
      <p className="mt-2 text-slate-600">{desc}</p>
    </div>
  );
}
function Label({ children }) {
  return <label className="mb-1.5 block text-sm font-medium text-slate-700">{children}</label>;
}
function Submit({ loading, children, onClick }) {
  return (
    <button onClick={onClick} disabled={loading} className="btn-primary mt-1 disabled:opacity-60">
      {loading && <Spinner />}
      {children}
    </button>
  );
}
function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z" />
    </svg>
  );
}
function useRun(fn) {
  const [loading, setLoading] = useState(false);
  const run = async (...a) => { setLoading(true); try { return await fn(...a); } finally { setLoading(false); } };
  return [loading, run];
}
function LinkCard({ href, title, meta, body }) {
  return (
    <li className="card">
      <a href={href} target="_blank" rel="noreferrer" className="font-semibold text-[var(--brand)] hover:underline">{title}</a>
      {meta && <p className="mt-1 text-xs text-slate-500">{meta}</p>}
      {body && <p className="mt-1.5 text-sm text-slate-600">{body}</p>}
    </li>
  );
}
function TextResult({ text }) {
  return <div className="mt-6 whitespace-pre-wrap rounded-2xl border border-slate-200 bg-white p-6 leading-relaxed text-slate-800 shadow-sm">{text}</div>;
}

/* ---------- tools ---------- */
function Assistant() {
  const [q, setQ] = useState("");
  const [out, setOut] = useState("");
  const [loading, run] = useRun(async () => {
    if (!q.trim()) return;
    setOut("");
    try { const r = await api.assistant(q); setOut(r.text || ""); }
    catch { setOut("Something went wrong. Please try again."); }
  });
  return (
    <div>
      <Head title="AI Career Assistant" desc="Ask anything about careers, education, job search, or scholarships. Answers are grounded in UNICEF, ILO, AfDB and UNESCO frameworks." />
      <Label>Your question</Label>
      <textarea className="field" rows={4} value={q} onChange={(e) => setQ(e.target.value)}
        placeholder="e.g., What digital skills should I build for a remote data job from Lagos?" />
      <Submit loading={loading} onClick={run}>{loading ? "Thinking…" : "Ask the assistant"}</Submit>
      {out && <TextResult text={out} />}
    </div>
  );
}

function Guidance() {
  const [answers, setAnswers] = useState("");
  const [out, setOut] = useState("");
  const [loading, run] = useRun(async () => {
    if (!answers.trim()) return;
    setOut("");
    try { const r = await api.careerGuidance(answers); setOut(r.text || ""); }
    catch { setOut("Something went wrong. Please try again."); }
  });
  return (
    <div>
      <Head title="Career Guidance" desc="Tell us about yourself and get a tailored roadmap: the best-matched career paths in Africa, the skills to build, and a concrete action plan." />
      <Label>Answer these 5 prompts</Label>
      <textarea className="field" rows={8} value={answers} onChange={(e) => setAnswers(e.target.value)}
        placeholder={"1. What are you interested in?\n2. What are you good at / your skills?\n3. What experience do you have (any kind)?\n4. Your education?\n5. What job or goal do you want?"} />
      <Submit loading={loading} onClick={run}>{loading ? "Preparing…" : "Get my roadmap"}</Submit>
      {out && <TextResult text={out} />}
    </div>
  );
}

function CvBuilder() {
  const [answers, setAnswers] = useState("");
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, run] = useRun(async () => {
    if (!answers.trim()) return;
    setMsg("");
    try { await api.cvFromAnswers({ answers, full_name: fullName, contact_line: contact }); setMsg("✓ Your premium CV downloaded as a .docx file."); }
    catch { setMsg("Something went wrong. Please try again."); }
  });
  return (
    <div>
      <Head title="CV Builder" desc="Answer a few prompts and download a premium, ATS-ready CV — with quantified achievements and clean, recruiter-friendly formatting. Nothing is invented." />
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label>Full name</Label><input className="field" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g., Amina Bello" /></div>
        <div><Label>Contact line</Label><input className="field" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="email · phone · city" /></div>
      </div>
      <div className="mt-4"><Label>About you (5 prompts)</Label>
        <textarea className="field" rows={7} value={answers} onChange={(e) => setAnswers(e.target.value)}
          placeholder={"1. Interests\n2. Skills\n3. Experience (jobs, volunteering, projects)\n4. Education\n5. Career goal"} /></div>
      <Submit loading={loading} onClick={run}>{loading ? "Building…" : "Generate CV (.docx)"}</Submit>
      {msg && <p className="mt-4 font-medium text-slate-700">{msg}</p>}
    </div>
  );
}

function CoverLetter() {
  const [resume, setResume] = useState("");
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [city, setCity] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, run] = useRun(async () => {
    if (!resume.trim() || !position.trim() || !company.trim()) return;
    setMsg("");
    try { await api.coverLetter({ resume_text: resume, position, company, city }); setMsg("✓ Your researched cover letter downloaded as a .docx file."); }
    catch { setMsg("Something went wrong. Please try again."); }
  });
  return (
    <div>
      <Head title="Cover Letter" desc="A compelling cover letter, researched live for the employer and mapped to the role — using only the facts you provide." />
      <div className="grid gap-4 sm:grid-cols-3">
        <div><Label>Target position</Label><input className="field" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Data Analyst" /></div>
        <div><Label>Company / org</Label><input className="field" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="UNICEF" /></div>
        <div><Label>City (optional)</Label><input className="field" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Nairobi" /></div>
      </div>
      <div className="mt-4"><Label>Your background / résumé</Label>
        <textarea className="field" rows={7} value={resume} onChange={(e) => setResume(e.target.value)}
          placeholder="Paste your résumé text or describe your experience, skills, and achievements." /></div>
      <Submit loading={loading} onClick={run}>{loading ? "Writing…" : "Generate cover letter (.docx)"}</Submit>
      {msg && <p className="mt-4 font-medium text-slate-700">{msg}</p>}
    </div>
  );
}

function Motivation() {
  const [category, setCategory] = useState("Undergraduate program");
  const [school, setSchool] = useState("");
  const [programme, setProgramme] = useState("");
  const [background, setBackground] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, run] = useRun(async () => {
    if (!school.trim() || !programme.trim() || !background.trim()) return;
    setMsg("");
    try { await api.motivationLetter({ category, school, programme, background }); setMsg("✓ Your motivation letter downloaded as a .docx file."); }
    catch { setMsg("Something went wrong. Please try again."); }
  });
  return (
    <div>
      <Head title="Motivation & Scholarship Letters" desc="A strong letter for a university or scholarship application — grounded in your real background and live research on the school." />
      <div className="grid gap-4 sm:grid-cols-3">
        <div><Label>Applying for</Label>
          <select className="field" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Undergraduate program</option><option>PhD / Doctorate position</option><option>Scholarship</option>
          </select></div>
        <div><Label>Institution</Label><input className="field" value={school} onChange={(e) => setSchool(e.target.value)} placeholder="University of Cape Town" /></div>
        <div><Label>Programme / scholarship</Label><input className="field" value={programme} onChange={(e) => setProgramme(e.target.value)} placeholder="MSc Public Health" /></div>
      </div>
      <div className="mt-4"><Label>Your background &amp; motivation</Label>
        <textarea className="field" rows={7} value={background} onChange={(e) => setBackground(e.target.value)}
          placeholder="Your education and grades, relevant experience/achievements, why this programme and school, and your goals." /></div>
      <Submit loading={loading} onClick={run}>{loading ? "Drafting…" : "Generate letter (.docx)"}</Submit>
      {msg && <p className="mt-4 font-medium text-slate-700">{msg}</p>}
    </div>
  );
}

function Jobs() {
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [results, setResults] = useState(null);
  const [loading, run] = useRun(async () => {
    if (!role.trim()) return;
    setResults(null);
    try { const r = await api.jobs({ role, location, include_ngo: true }); setResults(r.results || []); }
    catch { setResults([]); }
  });
  return (
    <div>
      <Head title="Live Job Search" desc="Current openings across LinkedIn, Indeed, Glassdoor and ZipRecruiter, plus WHO, UNICEF, Gavi, the UN and other NGOs. Every link is verified." />
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label>Role / keywords</Label><input className="field" value={role} onChange={(e) => setRole(e.target.value)} placeholder="monitoring & evaluation" /></div>
        <div><Label>Country or city</Label><input className="field" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Nigeria, Nairobi, Remote" /></div>
      </div>
      <Submit loading={loading} onClick={run}>{loading ? "Searching…" : "Search jobs"}</Submit>
      {results && results.length > 0 && (
        <ul className="mt-6 space-y-4">{results.map((j, i) => <LinkCard key={i} href={j.url} title={j.title} meta={`Source: ${j.source}`} body={j.snippet} />)}</ul>
      )}
      {results && results.length === 0 && !loading && <p className="mt-6 text-slate-500">No verified openings this time. Try broader keywords or a different location.</p>}
    </div>
  );
}

function Opportunities() {
  const [type, setType] = useState("Scholarship");
  const [field, setField] = useState("");
  const [region, setRegion] = useState("Africa");
  const [results, setResults] = useState(null);
  const [loading, run] = useRun(async () => {
    if (!field.trim()) return;
    setResults(null);
    try { const r = await api.opportunities({ opp_type: type, field, region }); setResults(r.results || []); }
    catch { setResults([]); }
  });
  return (
    <div>
      <Head title="Scholarships & Opportunities" desc="Search the live web for current scholarships, PhD positions, and admissions — with their requirements. Then draft your application in the Motivation Letters tool." />
      <div className="grid gap-4 sm:grid-cols-3">
        <div><Label>Type</Label>
          <select className="field" value={type} onChange={(e) => setType(e.target.value)}>
            <option>Scholarship</option><option>PhD / Doctorate</option><option>Undergraduate / Masters</option>
          </select></div>
        <div><Label>Field / subject</Label><input className="field" value={field} onChange={(e) => setField(e.target.value)} placeholder="public health" /></div>
        <div><Label>Region</Label>
          <select className="field" value={region} onChange={(e) => setRegion(e.target.value)}>
            <option>Africa</option><option>Europe</option><option>United Kingdom</option><option>Canada</option><option>United States</option><option>Asia</option>
          </select></div>
      </div>
      <Submit loading={loading} onClick={run}>{loading ? "Searching…" : "Find opportunities"}</Submit>
      {results && results.length > 0 && (
        <ul className="mt-6 space-y-4">{results.map((o, i) => <LinkCard key={i} href={o.url} title={o.title} />)}</ul>
      )}
      {results && results.length === 0 && !loading && <p className="mt-6 text-slate-500">No verified results this time. Try a broader field or a different region.</p>}
    </div>
  );
}

function Learning() {
  const [interest, setInterest] = useState("");
  const [cost, setCost] = useState("Free & Paid");
  const [results, setResults] = useState(null);
  const [loading, run] = useRun(async () => {
    if (!interest.trim()) return;
    setResults(null);
    try { const r = await api.courses({ interest, cost_pref: cost }); setResults(r.results || []); }
    catch { setResults([]); }
  });
  return (
    <div>
      <Head title="Learning Resources" desc="Verified courses matched to your goals, with your free-or-paid choice enforced. Every link is checked live — no broken or invented courses." />
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label>What do you want to learn?</Label><input className="field" value={interest} onChange={(e) => setInterest(e.target.value)} placeholder="data analysis, solar installation, digital marketing" /></div>
        <div><Label>Cost preference</Label>
          <select className="field" value={cost} onChange={(e) => setCost(e.target.value)}>
            <option>Free &amp; Paid</option><option>Free only</option><option>Paid only</option>
          </select></div>
      </div>
      <Submit loading={loading} onClick={run}>{loading ? "Finding…" : "Find courses"}</Submit>
      {results && results.length > 0 && (
        <ul className="mt-6 space-y-4">{results.map((c, i) => <LinkCard key={i} href={c.url} title={c.title} meta={[c.provider, c.cost, c.level, c.duration].filter(Boolean).join(" · ")} body={c.why} />)}</ul>
      )}
      {results && results.length === 0 && !loading && <p className="mt-6 text-slate-500">No results. Try a broader topic.</p>}
    </div>
  );
}
