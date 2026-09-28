"use client";

import { useState, useEffect, useId, cloneElement } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "../../lib/api";
import { SCHOOLS, REGIONS } from "../../lib/schools";

import CvDraftEditor from "../../components/CvDraftEditor";
import EvidencePanel from "../../components/EvidencePanel";
import FeedbackBar from "../../components/FeedbackBar";
import CareerConversation from "../../components/CareerConversation";
import PilotWelcome from "../../components/PilotWelcome";
import { readProfile } from "../../lib/profile";

/* ---------- icons ---------- */
function Icon({ d, className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {d}
    </svg>
  );
}
const I = {
  about: <><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></>,
  guidance: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" /></>,
  learning: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></>,
  assistant: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></>,
  resume: <><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" /><path d="M9 13h6M9 17h4" /></>,
  motivation: <><path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" /></>,
  jobs: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
};

const TABS = [
  ["about", "About", I.about],
  ["guidance", "Career Guidance", I.guidance],
  ["learning", "Learning Resources", I.learning],
  ["assistant", "AI Assistant", I.assistant],
  ["resume", "Résumé Analysis", I.resume],
  ["motivation", "Motivation Letters", I.motivation],
  ["jobs", "Job Search", I.jobs],
];

const LANGUAGES = [
  ["English", "English"], ["Français", "French"], ["Kiswahili", "Swahili"],
  ["العربية", "Arabic"], ["Hausa", "Hausa"], ["Pidgin", "Nigerian Pidgin"],
  ["Português", "Portuguese"], ["Español", "Spanish"], ["አማርኛ", "Amharic"],
];

export default function AppPage() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [tool, setTool] = useState("about");
  const [lang, setLang] = useState("English");

  useEffect(() => {
    const u = readProfile(); if (u) setUser(u);
    const requested = new URLSearchParams(window.location.search).get("tool");
    if (TABS.some(([key]) => key === requested)) setTool(requested);
    setReady(true);
  }, []);
  useEffect(() => {
    if (user?.analytics) api.event({ event: "section_accessed", user_name: user.participantId, country: user.country, language: lang, details: tool });
  }, [tool, user, lang]);

  function signOut() { try { localStorage.removeItem("aca_user"); sessionStorage.removeItem("aca_user"); } catch {} setUser(null); }

  if (!ready) return <div className="app-bg min-h-screen" />;
  if (!user) return <PilotWelcome onDone={setUser} />;

  return (
    <div className="app-bg min-h-screen" dir={lang === "Arabic" ? "rtl" : "ltr"}>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-extrabold tracking-tight text-slate-900">
            AfriCareer <span className="text-[var(--brand)]">AI</span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <select value={lang} onChange={(e) => setLang(e.target.value)} title="Response language"
              className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700 focus:border-[var(--brand)] focus:outline-none">
              {LANGUAGES.map(([l, v]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <span className="hidden text-sm text-slate-500 sm:inline">Hi, {user.name.split(" ")[0]}</span>
            <button onClick={signOut} className="text-sm font-medium text-slate-500 hover:text-slate-900">Clear profile</button>
            <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900">Home</Link>
          </div>
        </div>
      </header>

      {/* Mobile tabs */}
      <div className="border-b border-slate-200 bg-white/70 px-4 py-3 md:hidden">
        <div className="flex gap-2 overflow-x-auto">
          {TABS.map(([k, l]) => (
            <button key={k} aria-pressed={tool === k} onClick={() => setTool(k)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium ${tool === k ? "bg-[var(--brand)] text-white" : "bg-white text-slate-600 shadow-sm"}`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl gap-8 px-6 py-8">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 md:block">
          <nav className="sticky top-24 rounded-2xl border border-slate-200 bg-white/80 p-2 shadow-sm backdrop-blur">
            {TABS.map(([k, l, ic]) => {
              const active = tool === k;
              return (
                <button key={k} aria-pressed={tool === k} onClick={() => setTool(k)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${active ? "bg-blue-50 text-[var(--brand)]" : "text-slate-600 hover:bg-slate-50"}`}>
                  <span className={active ? "text-[var(--brand)]" : "text-slate-400"}><Icon d={ic} className="h-5 w-5" /></span>
                  {l}
                </button>
              );
            })}
          </nav>
          <div className="sticky top-[26rem] mt-4 rounded-2xl bg-gradient-to-br from-[var(--brand)] to-indigo-600 p-5 text-white shadow-lg shadow-blue-600/20">
            <p className="text-sm font-semibold">Free & multilingual</p>
            <p className="mt-1 text-xs text-blue-100">Explore options. Check sources. Make the next step your own.</p>
          </div>
        </aside>

        {/* Content */}
        <main id="main-content" className="min-w-0 flex-1">
          <div className={`mx-auto ${tool === "assistant" ? "max-w-4xl" : "max-w-2xl"}`}>
            <div className="pilot-banner"><strong>Free pilot · Your feedback shapes AfriCareer AI.</strong><br />Review AI suggestions and confirm opportunity details with the provider. The language selector applies to guidance, assistant answers and résumé feedback. Other tools and the interface currently use English.</div>
            <AnimatePresence mode="wait">
              <motion.div key={tool} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.24 }}>
                {tool === "about" && <About />}
                {tool === "guidance" && <Guidance lang={lang} />}
                {tool === "learning" && <Learning />}
                {tool === "assistant" && <Assistant lang={lang} />}
                {tool === "resume" && <Resume lang={lang} />}
                {tool === "motivation" && <Motivation />}
                {tool === "jobs" && <Jobs />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <footer className="mx-auto max-w-6xl px-6 pb-8 text-center text-xs text-slate-400">
        <div className="border-t border-slate-100 pt-6">
          <Link href="/privacy" className="hover:text-slate-600">Privacy</Link>
          <span className="mx-2">·</span>
          <Link href="/terms" className="hover:text-slate-600">Terms</Link>
          <span className="mx-2">·</span>
          © {new Date().getFullYear()} Quantium Insights LLC
        </div>
      </footer>
    </div>
  );
}

/* ---------- shared UI ---------- */
function ToolShell({ icon, title, desc, children }) {
  return (
    <div className="tool-card">
      <div className="mb-6 flex items-start gap-4">
        <div className="icon-badge"><Icon d={icon} /></div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
          {desc && <p className="mt-1.5 text-slate-500">{desc}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}
function Label({ children }) { return <label className="mb-1.5 block text-sm font-medium text-slate-700">{children}</label>; }
function Field({ label, children }) { const id = useId(); return <div><label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>{cloneElement(children, { id })}</div>; }
function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z" />
    </svg>
  );
}
function Submit({ loading, onClick, children, secondary }) {
  return (
    <><button onClick={onClick} disabled={loading} aria-busy={loading} className={`${secondary ? "btn-ghost" : "btn-primary"} mt-1 disabled:opacity-60`}>
      {loading && <Spinner />}{children}
    </button>{loading && <p role="status" className="mt-2 text-xs text-slate-600">Working on your request. Research and writing can take up to two minutes.</p>}</>
  );
}
function useRun(fn) {
  const [loading, setLoading] = useState(false);
  const run = async (...a) => { setLoading(true); try { return await fn(...a); } finally { setLoading(false); } };
  return [loading, run];
}
function Markdown({ children }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
      h1: (p) => <h2 className="mt-5 text-xl font-bold text-slate-900" {...p} />,
      h2: (p) => <h3 className="mt-5 text-lg font-semibold text-slate-900" {...p} />,
      h3: (p) => <h4 className="mt-4 font-semibold text-slate-900" {...p} />,
      p: (p) => <p className="mt-3 leading-relaxed text-slate-700" {...p} />,
      ul: (p) => <ul className="mt-3 list-disc space-y-1.5 pl-5 text-slate-700" {...p} />,
      ol: (p) => <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-slate-700" {...p} />,
      li: (p) => <li className="leading-relaxed" {...p} />,
      strong: (p) => <strong className="font-semibold text-slate-900" {...p} />,
      a: (p) => <a className="text-[var(--brand)] underline" target="_blank" rel="noreferrer" {...p} />,
      code: (p) => <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm" {...p} />,
    }}>{children}</ReactMarkdown>
  );
}
function Result({ title, children }) {
  return (
    <div role="status" className="result-content mt-6 rounded-2xl border border-slate-200 bg-white p-6">
      {title && <h3 className="text-lg font-bold text-slate-900">{title}</h3>}
      {children}
    </div>
  );
}
function LinkCard({ href, title, meta, body }) {
  return (
    <li className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <a href={href} target="_blank" rel="noreferrer" className="font-semibold text-[var(--brand)] hover:underline">{title}</a>
      {meta && <p className="mt-1 text-xs text-slate-500">{meta}</p>}
      {body && <p className="mt-1.5 text-sm text-slate-600">{body}</p>}
    </li>
  );
}

/* ---------- About (visual) ---------- */
const ABOUT_FEATURES = [
  [I.resume, "CV drafts & résumé analysis", "Editable CVs and practical feedback. Formatting and factual review; no employer ATS score is claimed."],
  [I.motivation, "Cover, motivation & scholarship letters", "Drafts based on your facts and the requirements you provide."],
  [I.jobs, "Live jobs & scholarships", "Search leads from job boards and organisations; confirm vacancy details."],
  [I.learning, "Learning resources", "Reviewed price terms where available; other links are marked as discovery."],
  [I.globe, "9 response languages", "Guidance in the language you are most comfortable in."],
  [I.shield, "Transparent source use", "Check the named document and page; general guidance is not verified evidence."],
];
function About() {
  return (
    <div className="space-y-6">
      <ToolShell icon={I.about} title="About AfriCareer AI" desc="AI-powered career and academic guidance for African youth and professionals.">
        <p className="leading-relaxed text-slate-600">
          AfriCareer AI puts a personal career and academic advisor in every young African's pocket - free,
          multilingual, with practical suggestions to review in your own context. Our mission is simple: empower African youth
          and professionals with high-quality, accessible guidance, from a first CV to a PhD scholarship letter.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {ABOUT_FEATURES.map(([ic, t, d]) => (
            <div key={t} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="icon-badge-sm"><Icon d={ic} className="h-5 w-5" /></div>
              <div>
                <p className="font-semibold text-slate-900">{t}</p>
                <p className="mt-0.5 text-sm text-slate-600">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </ToolShell>

      <div className="tool-card">
        <h2 className="text-lg font-bold text-slate-900">Understand the sources</h2>
        <p className="mt-1 text-sm text-slate-600">Only reviewed primary documents with traceable references should support evidence claims. When none is retrieved, the answer is general guidance. Source organisations do not endorse this app. <Link href="/knowledge" className="underline text-teal-800">Inspect the reference library.</Link></p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["African Union · CESA", "African Continental Qualifications Framework", "UNICEF · Transferable skills", "UNESCO · TVET", "Official university requirements"].map((c) => (
            <span key={c} className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-[var(--brand)]">{c}</span>
          ))}
        </div>
      </div>

      <div className="tool-card">
        <h2 className="text-lg font-bold text-slate-900">Developer</h2>
        <p className="mt-2 font-semibold text-slate-900">Dr. Amobi Andrew Onovo</p>
        <p className="text-sm text-slate-600">PhD Global Health · MPH · PGDip Data Science · Quantium Insights LLC</p>
        <p className="mt-4 text-sm text-slate-500">
          Safety & ethics: focused, appropriate guidance; culturally relevant to the African context; review AI suggestions and consult a qualified adviser for consequential decisions.
        </p>
      </div>
    </div>
  );
}

/* ---------- Career Guidance ---------- */
function Guidance({ lang }) {
  const [cvDraft,setCvDraft]=useState(null);
  const [error, setError] = useState("");
  const [profileAnswers, setProfileAnswers] = useState(["", "", "", "", ""]);
  const answers = profileAnswers.some(a => a.trim()) ? profileAnswers.map((a, i) => `${i + 1}. ${a}`).join("\n") : "";
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); const [city, setCity] = useState(""); const [linkedin, setLinkedin] = useState("");
  const [evidence, setEvidence] = useState(null);
  const [roadmap, setRoadmap] = useState(""); const [cvMsg, setCvMsg] = useState(""); const [showContact, setShowContact] = useState(false);
  const [gLoading, getGuidance] = useRun(async () => {
    if (!answers.trim()) { setError("Please describe your interests, skills, experience, education and goals first."); return; } setError(""); setRoadmap("");
    try { const r = await api.careerGuidance(answers, lang); setRoadmap(r.text || ""); setEvidence(r.evidence); } catch (error) { setError(error.message); }
  });
  const [cvLoading, genCv] = useRun(async () => {
    if (!answers.trim()) { setError("Answer the five prompts before generating a CV."); return; } setError(""); setCvMsg("");
    const contact = [email, phone, city, linkedin].map((x) => x.trim()).filter(Boolean).join(" | ");
    try { setCvDraft(null); const result=await api.cvDraft({source:"answers",content:answers,full_name:name.trim(),contact_line:contact}); setCvDraft(result); }
    catch (error) { setError(error.message); }
  });
  return (
    <ToolShell icon={I.guidance} title="Career Guidance & CV Builder" desc="Answer five prompts to get a tailored roadmap - and a clear, editable CV from the same answers.">
      <button onClick={() => setShowContact((s) => !s)} className="mb-4 text-sm font-semibold text-[var(--brand)]">
        {showContact ? "▾ " : "▸ "}Contact details (used on your CV)
      </button>
      {showContact && (
        <div className="mb-5 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:grid-cols-2">
          <Field label="Full name"><input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Amina Bello" /></Field>
          <Field label="Email"><input className="field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="amina@email.com" /></Field>
          <Field label="Phone"><input className="field" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 800 000 0000" /></Field>
          <Field label="City, Country"><input className="field" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Kano, Nigeria" /></Field>
          <div className="sm:col-span-2"><Field label="LinkedIn / Portfolio (optional)"><input className="field" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="linkedin.com/in/aminabello" /></Field></div>
        </div>
      )}
      <details open className="mb-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
        <summary className="cursor-pointer select-none font-semibold text-slate-900">Tell us about yourself - the 5 questions</summary>
        <div className="mt-3 space-y-3 text-sm">
          <p className="text-slate-600">Please answer these 5 simple questions (number your answers 1-5):</p>
          {[
            ["1. What are you interested in?", "Example: I like computers, helping people, cooking, fixing things, etc."],
            ["2. What are you good at? What skills do you have?", "Example: I'm good at math, I can speak 3 languages, I know how to use Excel, etc."],
            ["3. What work or experience do you have?", "Include ANY experience: part-time jobs, helping a family business, volunteer work, school projects, etc."],
            ["4. What is your education?", "Example: I finished secondary school in 2020, I'm studying at university, I completed a training course, etc."],
            ["5. What job do you want? What are your goals?", "Example: I want to work in a bank, I want to be a nurse, I want to start my own business, etc."],
          ].map(([q, ex]) => (
            <p key={q}><strong className="text-slate-800">{q}</strong><br /><span className="text-slate-500">({ex})</span></p>
          ))}
          <p className="text-slate-500">Write your answers below. Be honest - there are no wrong answers.</p>
        </div>
      </details>
      <div className="space-y-4">{["Interests and preferred work", "Skills and language levels", "Experience, volunteering and projects — include dates and actual results", "Education — include expected graduation if still studying", "Target role, location and goals"].map((label, i) => <Field key={label} label={label}><textarea className="field" rows={3} maxLength={3000} value={profileAnswers[i]} onChange={e => setProfileAnswers(prev => prev.map((a, n) => n === i ? e.target.value : a))} /></Field>)}</div>
      <p className="mt-3 text-sm text-slate-600">No paid experience is required. Include projects and volunteering. Keep numbers and qualifications factual; review every draft before sending it.</p>
      <div className="mt-2 flex flex-wrap gap-3">
        <Submit loading={gLoading} onClick={getGuidance}>{gLoading ? "Preparing…" : "Get career guidance"}</Submit>
        <Submit loading={cvLoading} onClick={genCv} secondary>{cvLoading ? "Building…" : "Build CV for review"}</Submit>
      </div>
      {cvMsg && <p className="mt-4 font-medium text-slate-700">{cvMsg}</p>}
      {cvDraft && <CvDraftEditor key={JSON.stringify(cvDraft)} draft={cvDraft} />}
      {error && <p role="alert" className="mt-4 text-red-700">{error}</p>}
      {roadmap && <Result title="Your Career Roadmap"><Markdown>{roadmap}</Markdown><EvidencePanel evidence={evidence} /><FeedbackBar tool="career_guidance" lang={lang} /></Result>}
    </ToolShell>
  );
}

/* ---------- Learning ---------- */
function Learning() {
  const [interest, setInterest] = useState(""); const [level, setLevel] = useState("Beginner"); const [cost, setCost] = useState("Free & Paid");
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);
  const [loading, run] = useRun(async () => {
    if (!interest.trim()) { setError("Enter a subject or skill to explore."); return; } setError(""); setResults(null);
    try { const r = await api.courses({ interest, level, cost_pref: cost }); setResults(r.results || []); } catch (error) { setError(error.message); }
  });
  return (
    <ToolShell icon={I.learning} title="Learning Resources" desc="Explore courses matched to your interests and budget. Confirm current fees and availability with each provider.">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-3"><Field label="What do you want to learn?"><input className="field" value={interest} onChange={(e) => setInterest(e.target.value)} placeholder="data analysis, solar installation, tailoring & small business" /></Field></div>
        <Field label="Cost preference"><select className="field" value={cost} onChange={(e) => setCost(e.target.value)}><option>Free &amp; Paid</option><option>Free only</option><option>Paid only</option></select></Field>
        <Field label="Your level"><select className="field" value={level} onChange={(e) => setLevel(e.target.value)}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></Field>
      </div>
      <Submit loading={loading} onClick={run}>{loading ? "Finding…" : "Find courses"}</Submit>
      {error && <p role="alert" className="mt-4 text-red-700">{error}</p>}
      {results && results.length > 0 && <ul className="mt-6 space-y-4">{results.map((c, i) => <LinkCard key={i} href={c.url} title={c.title} meta={[c.provider, c.cost, c.level, c.duration, c.reviewed_on ? `Price terms checked ${c.reviewed_on}` : ""].filter(Boolean).join(" · ")} body={c.why} />)}</ul>}
      {results && results.length === 0 && <p className="mt-6 text-slate-500">No reviewed courses match this topic, level and price filter. Our starter catalogue covers Python, Excel, statistics, speaking and social science. Choose Free & Paid to browse clearly marked discovery links.</p>}
    </ToolShell>
  );
}

/* ---------- AI Assistant ---------- */
function Assistant({ lang }) {
  return <CareerConversation lang={lang} Markdown={Markdown} FeedbackBar={FeedbackBar} />;
}

/* ---------- Résumé Analysis ---------- */
function Resume({ lang }) {
  const [error, setError] = useState("");
  const [cvDraft,setCvDraft]=useState(null);
  const [file, setFile] = useState(null); const [city, setCity] = useState(""); const [extra, setExtra] = useState("");
  const [resumeText, setResumeText] = useState(""); const [feedback, setFeedback] = useState("");
  const [position, setPosition] = useState(""); const [company, setCompany] = useState("");
  const [cvMsg, setCvMsg] = useState(""); const [clMsg, setClMsg] = useState("");
  const [loading, analyze] = useRun(async () => {
    if (!file) { setError("Choose a PDF, DOCX or TXT file first (up to 5 MB)."); return; } setError(""); setResumeText(""); setFeedback(""); setCvMsg(""); setClMsg("");
    try {
      const ex = await api.extractText(file); const text = ex.text || ""; setResumeText(text);
      const r = await api.analyzeResume({ resume_text: text, city, additional_info: extra, language: lang }); setFeedback(r.text || "");
    } catch (error) { setError(error.message); }
  });
  const [cvLoading, genCv] = useRun(async () => {
    if (!resumeText) return; setCvMsg("");
    try { setCvDraft(null); const result=await api.cvDraft({source:"resume",content:resumeText,feedback}); setCvDraft(result); } catch (error) { setCvMsg(error.message); }
  });
  const [clLoading, genCl] = useRun(async () => {
    if (!resumeText || !position.trim() || !company.trim()) return; setClMsg("");
    try { await api.coverLetter({ resume_text: resumeText, position, company, city }); setClMsg("✓ Cover letter downloaded (.docx)."); } catch (error) { setClMsg(error.message); }
  });
  return (
    <ToolShell icon={I.resume} title="Professional Résumé Analysis" desc="Upload your résumé for AI feedback tailored to your stated goals - then generate an improved CV and a cover letter based on your facts.">
      <Field label="Upload your résumé (PDF, DOCX, TXT; up to 5 MB)">
        <input type="file" accept=".pdf,.docx,.txt" onChange={(e) => { setFile(e.target.files?.[0] || null); setCvDraft(null); setResumeText(""); setFeedback(""); setError(""); }}
          className="block w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-[var(--brand)]" />
      </Field>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Your city (optional)"><input className="field" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Lagos, Nairobi, Accra" /></Field>
        <Field label="Target job description and priorities (optional)"><textarea className="field" rows={4} maxLength={6000} value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="Paste the job requirements to compare them with your actual experience. Missing requirements are gaps to address, not skills to invent." /></Field>
      </div>
      <Submit loading={loading} onClick={analyze}>{loading ? "Analyzing…" : "Analyze résumé"}</Submit>
      {error && <p role="alert" className="mt-4 text-red-700">{error}</p>}
      {feedback && (
        <>
          <Result title="Your Résumé Analysis"><Markdown>{feedback}</Markdown><FeedbackBar tool="resume_analysis" lang={lang} /></Result>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-slate-900">Create editable document drafts</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Field label="Target position (for cover letter)"><input className="field" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Data Analyst" /></Field>
              <Field label="Target company / organization"><input className="field" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="WHO, Dangote, Safaricom" /></Field>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <Submit loading={cvLoading} onClick={genCv}>{cvLoading ? "Building…" : "Review updated CV"}</Submit>
              <Submit loading={clLoading} onClick={genCl} secondary>{clLoading ? "Writing…" : "Generate cover letter (.docx)"}</Submit>
            </div>
            {cvMsg && <p className="mt-3 font-medium text-slate-700">{cvMsg}</p>}
            {clMsg && <p className="mt-1 font-medium text-slate-700">{clMsg}</p>}
            {cvDraft && <CvDraftEditor key={JSON.stringify(cvDraft)} draft={cvDraft} />}
          </div>
        </>
      )}
    </ToolShell>
  );
}

/* ---------- Motivation Letters ---------- */
function Motivation() {
  const [error, setError] = useState("");
  const [oppType, setOppType] = useState("Scholarship"); const [oppField, setOppField] = useState(""); const [oppRegion, setOppRegion] = useState("Africa");
  const [opps, setOpps] = useState(null);
  const [oppLoading, findOpps] = useRun(async () => {
    if (!oppField.trim()) { setError("Enter a field or subject for your search."); return; } setError(""); setOpps(null);
    try { const r = await api.opportunities({ opp_type: oppType, field: oppField, region: oppRegion }); setOpps(r.results || []); } catch (error) { setError(error.message); }
  });
  const [category, setCategory] = useState("Undergraduate program");
  const [requirements, setRequirements] = useState("");
  const [format, setFormat] = useState('auto');
  const [maxChars, setMaxChars] = useState('');
  const [maxWords, setMaxWords] = useState('');
  const [draft, setDraft] = useState(null);
  const [draftInput, setDraftInput] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [applicantName, setApplicantName] = useState("");
  const [contactLine, setContactLine] = useState("");
  const [region, setRegion] = useState("Africa");
  const [school, setSchool] = useState(SCHOOLS["Africa"][0]);
  const [custom, setCustom] = useState(""); const [programme, setProgramme] = useState(""); const [background, setBackground] = useState(""); const [msg, setMsg] = useState("");
  const [loading, gen] = useRun(async () => {
    const inst = custom.trim() || (school.startsWith("Other") ? "" : school);
    if (!inst || !programme.trim() || !background.trim()) { setError("Add the institution, programme and your background first."); return; } setError(""); setMsg("");
    try {
      const input={category, school: inst, programme, background, prog_info: requirements, full_name: applicantName, contact_line: contactLine, document_format: format, max_characters:maxChars?Number(maxChars):null, max_words:maxWords?Number(maxWords):null};
      setDraft(null); setConfirmed(false);
      const result=await api.applicationDraft(input); setDraft(result); setDraftInput(input);
    }
    catch (error) { setError(error.message); }
  });
  const [downloading, download] = useRun(async()=>{
    if(!draft || !confirmed) return;
    setError(''); setMsg('');
    try { await api.applicationDocument({...draftInput,sections:draft.sections.map(s=>({text:s.text})),confirmed}); setMsg('Your reviewed application draft downloaded. Check it in the application portal before submitting.'); }
    catch(e){setError(e.message);}
  });
  const draftChars=draft ? draft.sections.reduce((n,s)=>n+s.text.trim().length,0)+(draft.rules.format==='ucas'?0:2*(draft.sections.length-1)) : 0;
  const draftWords=draft ? draft.sections.reduce((n,s)=>n+(s.text.trim()?s.text.trim().split(/\s+/).length:0),0) : 0;
  return (
    <ToolShell icon={I.motivation} title="Motivation & Scholarship Letters" desc="Build a tailored application draft from your facts and the programme’s requirements. Review and edit before downloading.">
      <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
        <h3 className="font-bold text-slate-900">Find live opportunities</h3>
        <p className="mt-1 text-sm text-slate-600">Search the web in real time for current scholarships, PhD positions, and admissions.</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <Field label="Type"><select className="field" value={oppType} onChange={(e) => setOppType(e.target.value)}><option>Scholarship</option><option>PhD / Doctorate</option><option>Undergraduate / Masters</option></select></Field>
          <Field label="Field / subject"><input className="field" value={oppField} onChange={(e) => setOppField(e.target.value)} placeholder="public health" /></Field>
          <Field label="Region"><select className="field" value={oppRegion} onChange={(e) => setOppRegion(e.target.value)}>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select></Field>
        </div>
        <Submit loading={oppLoading} onClick={findOpps}>{oppLoading ? "Searching…" : "Search opportunities"}</Submit>
        {opps && opps.length > 0 && <ul className="mt-4 space-y-3">{opps.map((o, i) => <LinkCard key={i} href={o.url} title={o.title} meta={o.verification || "Discovery lead — check degree type, region, eligibility and deadline"} />)}</ul>}
        {opps && opps.length === 0 && <p className="mt-4 text-sm text-slate-500">No discovery results. Try a broader field or different region.</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Applying for"><select className="field" value={category} onChange={(e) => setCategory(e.target.value)}><option>Undergraduate program</option><option>PhD / Doctorate position</option><option>Scholarship</option></select></Field>
        <Field label="Region"><select className="field" value={region} onChange={(e) => { setRegion(e.target.value); setSchool(SCHOOLS[e.target.value][0]); }}>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select></Field>
        <Field label="Institution"><select className="field" value={school} onChange={(e) => setSchool(e.target.value)}>{SCHOOLS[region].map((s) => <option key={s}>{s}</option>)}</select></Field>
      </div>
      <div className="mt-4"><Field label="Or type the exact institution (overrides the list)"><input className="field" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="e.g., University of Navarra" /></Field></div>
      <div className="mt-4"><Field label="Programme / scholarship name"><input className="field" value={programme} onChange={(e) => setProgramme(e.target.value)} placeholder="MSc Public Health, Chevening Scholarship" /></Field></div>
      <div className="mt-4"><Field label="Your background & motivation"><textarea className="field" rows={7} value={background} onChange={(e) => setBackground(e.target.value)} placeholder="Your education and grades, relevant experience and achievements, why this programme and school, and your goals." /></Field></div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="Applicant name"><input className="field" value={applicantName} onChange={e => setApplicantName(e.target.value)} /></Field><Field label="Contact line"><input className="field" value={contactLine} onChange={e => setContactLine(e.target.value)} /></Field></div>
      <div className="mt-4"><Field label="Official application requirements and programme details"><textarea className="field" rows={5} maxLength={4000} value={requirements} onChange={e => setRequirements(e.target.value)} placeholder="Paste the current official prompts, word/character limit, programme URL, research interests and any confirmed supervisor details." /></Field></div>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Field label="Document format"><select className="field" value={format} onChange={e=>setFormat(e.target.value)}><option value="auto">Use programme preset if available</option><option value="letter">Motivation letter</option><option value="statement">Personal statement</option><option value="ucas">UCAS: three answers</option><option value="research_proposal">Research proposal outline</option></select></Field>
        <Field label="Maximum characters (optional)"><input type="number" min="200" max="20000" className="field" value={maxChars} onChange={e=>setMaxChars(e.target.value)} /></Field>
        <Field label="Maximum words (optional)"><input type="number" min="50" max="4000" className="field" value={maxWords} onChange={e=>setMaxWords(e.target.value)} /></Field>
      </div>
      <p className="mt-3 text-sm text-slate-600">Automatic presets cover Oxford undergraduate UCAS and Cambridge’s PhD in Public Health and Primary Care only. For other programmes, select the required format and enter the official limits. Research proposals need your original research design and verified literature.</p>
      <Submit loading={loading} onClick={gen}>{loading ? "Drafting and checking…" : "Create draft for review"}</Submit>
      {draft && <div className="mt-6 rounded-xl border border-teal-200 bg-teal-50/40 p-5">
        <h3 className="text-xl font-bold">Review your draft</h3><p className="mt-2 text-sm">{draft.review_notice}</p>
        <p className="mt-2 text-sm">This draft uses the inputs saved when you generated it. If you change the programme or background above, generate a new draft.</p>
        {draft.rules.requirements_url && <a className="mt-2 inline-block underline text-teal-800" href={draft.rules.requirements_url} target="_blank" rel="noopener noreferrer">Official format reference · reviewed {draft.rules.requirements_reviewed_on}</a>}
        {draft.sections.map((s,i)=><div key={i} className="mt-4"><Field label={s.heading}><textarea className="field" rows={8} value={s.text} maxLength={20000} onChange={e=>{setConfirmed(false);setMsg('');setDraft({...draft,sections:draft.sections.map((x,j)=>j===i?{...x,text:e.target.value}:x)});}} /></Field><p className="mt-1 text-xs">{s.text.trim().length} characters{draft.rules.format==='ucas'?' · minimum 350':''}</p></div>)}
        <p role="status" className="mt-4 font-semibold">{draftChars} characters{draft.rules.max_characters?` / ${draft.rules.max_characters}`:''} · {draftWords} words{draft.rules.max_words?` / ${draft.rules.max_words}`:''}</p>
        <p className="mt-1 text-xs">Counts include spaces and paragraph breaks in the answers, excluding section labels. Confirm the final count in the destination portal.</p>
        <ul className="mt-3 list-disc pl-5 text-sm">{draft.rules.checklist.map(x=><li key={x}>{x}</li>)}</ul>
        <label className="mt-4 flex gap-2 text-sm"><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)} />I reviewed the facts, wording and current application requirements.</label>
        <button className="btn-primary mt-4" disabled={!confirmed || downloading} onClick={download}>{downloading?'Checking and downloading…':'Download reviewed draft (.docx)'}</button>
      </div>}
      {error && <p role="alert" className="mt-4 text-red-700">{error}</p>}
      {msg && <p className="mt-4 font-medium text-slate-700">{msg}</p>}
    </ToolShell>
  );
}

/* ---------- Job Search ---------- */
function Jobs() {
  const [error, setError] = useState("");
  const [role, setRole] = useState(""); const [discipline, setDiscipline] = useState(""); const [location, setLocation] = useState("");
  const [period, setPeriod] = useState("Any time"); const [experience, setExperience] = useState("Any"); const [workMode, setWorkMode] = useState("Any"); const [ngo, setNgo] = useState(true);
  const [results, setResults] = useState(null);
  const [searchInfo, setSearchInfo] = useState(null);
  const [loading, run] = useRun(async () => {
    if (!role.trim()) { setError("Enter a role or keyword to search."); return; } setError(""); setResults(null); setSearchInfo(null);
    try { const r = await api.jobs({ role, discipline, location, period, experience, work_mode: workMode, include_ngo: ngo }); setResults(r.results || []); setSearchInfo(r); } catch (error) { setError(error.message); }
  });
  return (
    <ToolShell icon={I.jobs} title="Live Job Search" desc="Explore job listings and job-board searches. Confirm each vacancy, deadline and employer on the original website.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Role / keywords"><input className="field" value={role} onChange={(e) => setRole(e.target.value)} placeholder="monitoring & evaluation, data scientist, nurse" /></Field>
        <Field label="Discipline"><input className="field" value={discipline} onChange={(e) => setDiscipline(e.target.value)} placeholder="public health, ICT, finance" /></Field>
        <Field label="Country or city"><input className="field" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Nigeria, Nairobi, Remote" /></Field>
        <Field label="Posted"><select className="field" value={period} onChange={(e) => setPeriod(e.target.value)}><option>Any time</option><option>Past 24 hours</option><option>Past week</option><option>Past month</option></select></Field>
        <Field label="Experience"><select className="field" value={experience} onChange={(e) => setExperience(e.target.value)}><option>Any</option><option>Entry level</option><option>Mid level</option><option>Senior</option><option>Executive</option></select></Field>
        <Field label="Work mode"><select className="field" value={workMode} onChange={(e) => setWorkMode(e.target.value)}><option>Any</option><option>Remote</option><option>On-site</option><option>Hybrid</option></select></Field>
      </div>
      <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={ngo} onChange={(e) => setNgo(e.target.checked)} className="h-4 w-4 rounded" />
        Include NGOs &amp; UN / international organizations
      </label>
      <Submit loading={loading} onClick={run}>{loading ? "Searching…" : "Search jobs"}</Submit>
      {error && <p role="alert" className="mt-4 text-red-700">{error}</p>}
      {searchInfo && <div className="mt-6 rounded-xl bg-teal-50 p-4 text-sm text-slate-700" role="status"><p>{searchInfo.notice}</p>{searchInfo.coverage && <p className="mt-2">Searched {searchInfo.coverage.filter(c => c.status === "searched").length} of {searchInfo.coverage.length} discovery channels · {searchInfo.source_count || 0} result sources. Employer recruitment sites and regional searches help widen coverage; results are not a complete market inventory.</p>}{(searchInfo.warnings || []).map((w,i) => <p key={i}>{w}</p>)}</div>}
      {results && results.length > 0 && <ul className="mt-6 space-y-4">{results.map((j, i) => <LinkCard key={i} href={j.url} title={j.title} meta={`Source: ${j.source} · ${j.verification_level === "posting_metadata" ? "Posting details checked" : j.verification_level === "board_search" ? "Job-board search" : "Unconfirmed lead"}`} body={[j.snippet, j.verification, ...(j.filter_notes || [])].filter(Boolean).join(" ")} />)}</ul>}
      {results && results.length === 0 && <p className="mt-6 text-slate-500">No individual matches could be confirmed. This does not mean there are no jobs. Continue with the searches below or broaden your keywords.</p>}
      {searchInfo?.search_links?.length > 0 && <div className="mt-6 border-t pt-5"><h3 className="font-semibold">Continue your search on job boards</h3><p className="mt-2 text-sm text-slate-600">These links carry your keywords and location. Set date and experience filters on the provider's site. These are search pages, not verified vacancies.</p><ul className="mt-3 space-y-3">{searchInfo.search_links.map(j => <LinkCard key={j.url} href={j.url} title={j.title} meta={j.source} body="Open matching search keywords" />)}</ul></div>}

    </ToolShell>
  );
}
