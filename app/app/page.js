"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "../../lib/api";
import { SCHOOLS, REGIONS } from "../../lib/schools";
import { COUNTRIES } from "../../lib/countries";

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

export default function AppPage() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [tool, setTool] = useState("about");

  useEffect(() => {
    try { const u = JSON.parse(localStorage.getItem("aca_user") || "null"); if (u && u.name) setUser(u); } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (user) api.event({ event: "section_accessed", user_name: user.name, country: user.country, details: tool });
  }, [tool, user]);

  function signOut() { try { localStorage.removeItem("aca_user"); } catch {} setUser(null); }

  if (!ready) return <div className="app-bg min-h-screen" />;
  if (!user) return <SignIn onDone={setUser} />;

  return (
    <div className="app-bg min-h-screen">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-extrabold tracking-tight text-slate-900">
            AfriCareer <span className="text-[var(--brand)]">AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-500 sm:inline">Hi, {user.name.split(" ")[0]}</span>
            <button onClick={signOut} className="text-sm font-medium text-slate-500 hover:text-slate-900">Sign out</button>
            <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900">Home</Link>
          </div>
        </div>
      </header>

      {/* Mobile tabs */}
      <div className="border-b border-slate-200 bg-white/70 px-4 py-3 md:hidden">
        <div className="flex gap-2 overflow-x-auto">
          {TABS.map(([k, l]) => (
            <button key={k} onClick={() => setTool(k)}
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
                <button key={k} onClick={() => setTool(k)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${active ? "bg-blue-50 text-[var(--brand)]" : "text-slate-600 hover:bg-slate-50"}`}>
                  <span className={active ? "text-[var(--brand)]" : "text-slate-400"}><Icon d={ic} className="h-5 w-5" /></span>
                  {l}
                </button>
              );
            })}
          </nav>
          <div className="sticky top-[26rem] mt-4 rounded-2xl bg-gradient-to-br from-[var(--brand)] to-indigo-600 p-5 text-white shadow-lg shadow-blue-600/20">
            <p className="text-sm font-semibold">Free & multilingual</p>
            <p className="mt-1 text-xs text-blue-100">Every result is grounded in real evidence and verified live.</p>
          </div>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div key={tool} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.24 }}>
                {tool === "about" && <About />}
                {tool === "guidance" && <Guidance />}
                {tool === "learning" && <Learning />}
                {tool === "assistant" && <Assistant />}
                {tool === "resume" && <Resume />}
                {tool === "motivation" && <Motivation />}
                {tool === "jobs" && <Jobs />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ---------- sign-in gate ---------- */
function SignIn({ onDone }) {
  const [name, setName] = useState("");
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [err, setErr] = useState("");
  function enter() {
    if (!name.trim()) return setErr("Please enter your name.");
    if (country === COUNTRIES[0]) return setErr("Please select your country.");
    if (!consent) return setErr("Please tick the consent box to continue.");
    const user = { name: name.trim(), country, email: email.trim() };
    try { localStorage.setItem("aca_user", JSON.stringify(user)); } catch {}
    api.event({ event: "login", user_name: user.name, country: user.country, details: user.email });
    api.event({ event: "user_visit", user_name: user.name, country: user.country });
    onDone(user);
  }
  const chips = ["ATS CVs", "Cover & motivation letters", "Live jobs & scholarships", "Verified courses", "9 languages"];
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#182a7a] via-[var(--brand)] to-indigo-700" />
      <motion.div className="pointer-events-none absolute -left-24 top-8 h-80 w-80 rounded-full bg-sky-400/30 blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="pointer-events-none absolute right-0 top-1/4 h-96 w-96 rounded-full bg-indigo-400/30 blur-3xl"
        animate={{ x: [0, -40, 0], y: [0, 50, 0] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="pointer-events-none absolute -bottom-16 left-1/3 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl"
        animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }} />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="hidden text-white lg:block">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">Free · Multilingual · Built for Africa</span>
            <h1 className="mt-5 text-5xl font-extrabold leading-tight">AfriCareer <span className="text-sky-200">AI</span></h1>
            <p className="mt-4 max-w-md text-lg text-blue-100">Career and academic guidance for African youth and professionals. Build CVs, write letters, and find jobs, courses and scholarships - all in one place.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {chips.map((c) => <span key={c} className="rounded-full bg-white/15 px-3 py-1 text-sm text-white backdrop-blur">{c}</span>)}
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 overflow-hidden rounded-3xl border border-white/20 shadow-2xl">
              <div className="aspect-[16/10] bg-cover bg-center" style={{ backgroundImage: "url('/hero.jpg')" }} />
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mx-auto w-full max-w-md">
            <div className="mb-5 text-center lg:hidden">
              <h1 className="text-3xl font-extrabold text-white">AfriCareer <span className="text-sky-200">AI</span></h1>
              <p className="mt-1 text-sm text-blue-100">Career & academic guidance, built for you.</p>
            </div>
            <div className="rounded-3xl bg-white/95 p-8 shadow-2xl backdrop-blur">
              <h2 className="text-2xl font-bold text-slate-900">Sign in to continue</h2>
              <p className="mt-1 text-sm text-slate-500">Takes 10 seconds - no password needed.</p>
              <div className="mt-5 space-y-4">
                <Field label="Full name"><input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Amina Bello" /></Field>
                <Field label="Country"><select className="field" value={country} onChange={(e) => setCountry(e.target.value)}>{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
                <Field label="Email (optional)"><input className="field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" /></Field>
                <label className="flex items-start gap-2 text-sm text-slate-600">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4" />
                  I agree that my name and country may be stored to help improve this free service.
                </label>
                {err && <p className="text-sm text-red-600">{err}</p>}
                <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={enter}
                  className="w-full rounded-xl bg-[var(--brand)] px-6 py-3 font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:bg-[var(--brand-dark)]">
                  Enter AfriCareer AI
                </motion.button>
                <p className="text-xs text-slate-400">Free to use. We store your name and country (and email if given) only to improve the service. We never sell your data or share it externally.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
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
function Field({ label, children }) { return <div><Label>{label}</Label>{children}</div>; }
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
    <button onClick={onClick} disabled={loading} className={`${secondary ? "btn-ghost" : "btn-primary"} mt-1 disabled:opacity-60`}>
      {loading && <Spinner />}{children}
    </button>
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
    <div className="mt-6 rounded-2xl border border-slate-200 bg-gradient-to-b from-blue-50/40 to-white p-6">
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
  [I.resume, "ATS CVs & résumé analysis", "Recruiter-ready CVs with an ATS score and concrete fixes."],
  [I.motivation, "Cover, motivation & scholarship letters", "Researched and grounded in live study of the employer or school."],
  [I.jobs, "Live jobs & scholarships", "Verified openings across boards, NGOs, and the UN."],
  [I.learning, "Verified learning links", "Free and paid courses, each checked live."],
  [I.globe, "9 African languages", "Guidance in the language you are most comfortable in."],
  [I.shield, "Grounded in real evidence", "UNICEF, ILO, AfDB and UNESCO frameworks via RAG."],
];
function About() {
  return (
    <div className="space-y-6">
      <ToolShell icon={I.about} title="About AfriCareer AI" desc="AI-powered career and academic guidance for African youth and professionals.">
        <p className="leading-relaxed text-slate-600">
          AfriCareer AI puts a personal career and academic advisor in every young African's pocket - free,
          multilingual, and grounded in trusted global evidence. Our mission is simple: empower African youth
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
        <h2 className="text-lg font-bold text-slate-900">Grounded in trusted evidence</h2>
        <p className="mt-1 text-sm text-slate-600">Answers are retrieval-augmented from authoritative frameworks and best-practice guides.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["AfDB · SEPA", "UNICEF Education Strategy", "ILO Youth Employment", "UNESCO", "Scholarship & PhD best practices"].map((c) => (
            <span key={c} className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-[var(--brand)]">{c}</span>
          ))}
        </div>
      </div>

      <div className="tool-card">
        <h2 className="text-lg font-bold text-slate-900">Developer</h2>
        <p className="mt-2 font-semibold text-slate-900">Dr. Amobi Andrew Onovo</p>
        <p className="text-sm text-slate-600">PhD Global Health · MPH · PGDip Data Science · Quantium Insights LLC</p>
        <p className="mt-4 text-sm text-slate-500">
          Safety & ethics: focused, appropriate guidance; culturally relevant to the African context; evidence-based recommendations from trusted sources.
        </p>
      </div>
    </div>
  );
}

/* ---------- Career Guidance ---------- */
function Guidance() {
  const [answers, setAnswers] = useState("");
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); const [city, setCity] = useState(""); const [linkedin, setLinkedin] = useState("");
  const [roadmap, setRoadmap] = useState(""); const [cvMsg, setCvMsg] = useState(""); const [showContact, setShowContact] = useState(false);
  const [gLoading, getGuidance] = useRun(async () => {
    if (!answers.trim()) return; setRoadmap("");
    try { const r = await api.careerGuidance(answers); setRoadmap(r.text || ""); } catch { setRoadmap("Something went wrong. Please try again."); }
  });
  const [cvLoading, genCv] = useRun(async () => {
    if (!answers.trim()) return; setCvMsg("");
    const contact = [email, phone, city, linkedin].map((x) => x.trim()).filter(Boolean).join(" | ");
    try { await api.cvFromAnswers({ answers, full_name: name.trim(), contact_line: contact }); setCvMsg("✓ Your premium CV downloaded as a .docx file."); }
    catch { setCvMsg("Something went wrong. Please try again."); }
  });
  return (
    <ToolShell icon={I.guidance} title="Career Guidance & CV Builder" desc="Answer five prompts to get a tailored roadmap - and a premium, ATS-ready CV from the same answers.">
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
      <Label>Your answers (number them 1-5)</Label>
      <textarea className="field" rows={8} value={answers} onChange={(e) => setAnswers(e.target.value)}
        placeholder={"1. I'm interested in...\n2. My strengths...\n3. I have experience...\n4. My education...\n5. My goals..."} />
      <div className="mt-2 flex flex-wrap gap-3">
        <Submit loading={gLoading} onClick={getGuidance}>{gLoading ? "Preparing…" : "Get career guidance"}</Submit>
        <Submit loading={cvLoading} onClick={genCv} secondary>{cvLoading ? "Building…" : "Generate premium CV (.docx)"}</Submit>
      </div>
      {cvMsg && <p className="mt-4 font-medium text-slate-700">{cvMsg}</p>}
      {roadmap && <Result title="Your Career Roadmap"><Markdown>{roadmap}</Markdown></Result>}
    </ToolShell>
  );
}

/* ---------- Learning ---------- */
function Learning() {
  const [interest, setInterest] = useState(""); const [level, setLevel] = useState("Beginner"); const [cost, setCost] = useState("Free & Paid");
  const [results, setResults] = useState(null);
  const [loading, run] = useRun(async () => {
    if (!interest.trim()) return; setResults(null);
    try { const r = await api.courses({ interest, level, cost_pref: cost }); setResults(r.results || []); } catch { setResults([]); }
  });
  return (
    <ToolShell icon={I.learning} title="Learning Resources" desc="Verified courses matched to your goals, with your free-or-paid choice enforced. Every link is checked live.">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-3"><Field label="What do you want to learn?"><input className="field" value={interest} onChange={(e) => setInterest(e.target.value)} placeholder="data analysis, solar installation, tailoring & small business" /></Field></div>
        <Field label="Cost preference"><select className="field" value={cost} onChange={(e) => setCost(e.target.value)}><option>Free &amp; Paid</option><option>Free only</option><option>Paid only</option></select></Field>
        <Field label="Your level"><select className="field" value={level} onChange={(e) => setLevel(e.target.value)}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></Field>
      </div>
      <Submit loading={loading} onClick={run}>{loading ? "Finding…" : "Find courses"}</Submit>
      {results && results.length > 0 && <ul className="mt-6 space-y-4">{results.map((c, i) => <LinkCard key={i} href={c.url} title={c.title} meta={[c.provider, c.cost, c.level, c.duration].filter(Boolean).join(" · ")} body={c.why} />)}</ul>}
      {results && results.length === 0 && <p className="mt-6 text-slate-500">No results. Try a broader topic.</p>}
    </ToolShell>
  );
}

/* ---------- AI Assistant ---------- */
function Assistant() {
  const [q, setQ] = useState(""); const [out, setOut] = useState("");
  const [loading, run] = useRun(async () => {
    if (!q.trim()) return; setOut("");
    try { const r = await api.assistant(q); setOut(r.text || ""); } catch { setOut("Something went wrong. Please try again."); }
  });
  return (
    <ToolShell icon={I.assistant} title="AI Career Assistant" desc="Ask anything about careers, education, job search, or scholarships - grounded in UNICEF, ILO, AfDB and UNESCO frameworks.">
      <Label>Your question</Label>
      <textarea className="field" rows={4} value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g., What digital skills should I build for a data role in Lagos?" />
      <Submit loading={loading} onClick={run}>{loading ? "Thinking…" : "Ask the assistant"}</Submit>
      {out && <Result><Markdown>{out}</Markdown></Result>}
    </ToolShell>
  );
}

/* ---------- Résumé Analysis ---------- */
function Resume() {
  const [file, setFile] = useState(null); const [city, setCity] = useState(""); const [extra, setExtra] = useState("");
  const [resumeText, setResumeText] = useState(""); const [feedback, setFeedback] = useState("");
  const [position, setPosition] = useState(""); const [company, setCompany] = useState("");
  const [cvMsg, setCvMsg] = useState(""); const [clMsg, setClMsg] = useState("");
  const [loading, analyze] = useRun(async () => {
    if (!file) return; setFeedback(""); setCvMsg(""); setClMsg("");
    try {
      const ex = await api.extractText(file); const text = ex.text || ""; setResumeText(text);
      const r = await api.analyzeResume({ resume_text: text, city, additional_info: extra }); setFeedback(r.text || "");
    } catch { setFeedback("Could not read or analyze that file. Try a text-based PDF, DOCX, or TXT."); }
  });
  const [cvLoading, genCv] = useRun(async () => {
    if (!resumeText) return; setCvMsg("");
    try { await api.cvFromResume({ resume_text: resumeText, feedback }); setCvMsg("✓ Updated CV downloaded (.docx)."); } catch { setCvMsg("Something went wrong."); }
  });
  const [clLoading, genCl] = useRun(async () => {
    if (!resumeText || !position.trim() || !company.trim()) return; setClMsg("");
    try { await api.coverLetter({ resume_text: resumeText, position, company, city }); setClMsg("✓ Cover letter downloaded (.docx)."); } catch { setClMsg("Something went wrong."); }
  });
  return (
    <ToolShell icon={I.resume} title="Professional Résumé Analysis" desc="Upload your résumé for expert feedback grounded in the African job market - then generate an improved CV and a researched cover letter.">
      <Field label="Upload your résumé (PDF, DOCX, TXT)">
        <input type="file" accept=".pdf,.docx,.txt" onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-[var(--brand)]" />
      </Field>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Your city (optional)"><input className="field" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Lagos, Nairobi, Accra" /></Field>
        <Field label="Additional info (optional)"><input className="field" value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="Target industry, preferred roles" /></Field>
      </div>
      <Submit loading={loading} onClick={analyze}>{loading ? "Analyzing…" : "Analyze résumé"}</Submit>
      {feedback && (
        <>
          <Result title="Your Résumé Analysis"><Markdown>{feedback}</Markdown></Result>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-slate-900">Generate premium documents</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Field label="Target position (for cover letter)"><input className="field" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Data Analyst" /></Field>
              <Field label="Target company / organization"><input className="field" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="WHO, Dangote, Safaricom" /></Field>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <Submit loading={cvLoading} onClick={genCv}>{cvLoading ? "Building…" : "Generate updated CV (.docx)"}</Submit>
              <Submit loading={clLoading} onClick={genCl} secondary>{clLoading ? "Writing…" : "Generate cover letter (.docx)"}</Submit>
            </div>
            {cvMsg && <p className="mt-3 font-medium text-slate-700">{cvMsg}</p>}
            {clMsg && <p className="mt-1 font-medium text-slate-700">{clMsg}</p>}
          </div>
        </>
      )}
    </ToolShell>
  );
}

/* ---------- Motivation Letters ---------- */
function Motivation() {
  const [oppType, setOppType] = useState("Scholarship"); const [oppField, setOppField] = useState(""); const [oppRegion, setOppRegion] = useState("Africa");
  const [opps, setOpps] = useState(null);
  const [oppLoading, findOpps] = useRun(async () => {
    if (!oppField.trim()) return; setOpps(null);
    try { const r = await api.opportunities({ opp_type: oppType, field: oppField, region: oppRegion }); setOpps(r.results || []); } catch { setOpps([]); }
  });
  const [category, setCategory] = useState("Undergraduate program");
  const [region, setRegion] = useState("Africa");
  const [school, setSchool] = useState(SCHOOLS["Africa"][0]);
  const [custom, setCustom] = useState(""); const [programme, setProgramme] = useState(""); const [background, setBackground] = useState(""); const [msg, setMsg] = useState("");
  const [loading, gen] = useRun(async () => {
    const inst = custom.trim() || (school.startsWith("Other") ? "" : school);
    if (!inst || !programme.trim() || !background.trim()) return; setMsg("");
    try { await api.motivationLetter({ category, school: inst, programme, background }); setMsg("✓ Motivation letter downloaded (.docx)."); }
    catch { setMsg("Something went wrong. Please try again."); }
  });
  return (
    <ToolShell icon={I.motivation} title="Motivation & Scholarship Letters" desc="Generate a strong letter for a university or scholarship application - grounded in your background and live research on the school.">
      <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
        <h3 className="font-bold text-slate-900">Find live opportunities</h3>
        <p className="mt-1 text-sm text-slate-600">Search the web in real time for current scholarships, PhD positions, and admissions.</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <Field label="Type"><select className="field" value={oppType} onChange={(e) => setOppType(e.target.value)}><option>Scholarship</option><option>PhD / Doctorate</option><option>Undergraduate / Masters</option></select></Field>
          <Field label="Field / subject"><input className="field" value={oppField} onChange={(e) => setOppField(e.target.value)} placeholder="public health" /></Field>
          <Field label="Region"><select className="field" value={oppRegion} onChange={(e) => setOppRegion(e.target.value)}>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select></Field>
        </div>
        <Submit loading={oppLoading} onClick={findOpps}>{oppLoading ? "Searching…" : "Search opportunities"}</Submit>
        {opps && opps.length > 0 && <ul className="mt-4 space-y-3">{opps.map((o, i) => <LinkCard key={i} href={o.url} title={o.title} />)}</ul>}
        {opps && opps.length === 0 && <p className="mt-4 text-sm text-slate-500">No verified results. Try a broader field or different region.</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Applying for"><select className="field" value={category} onChange={(e) => setCategory(e.target.value)}><option>Undergraduate program</option><option>PhD / Doctorate position</option><option>Scholarship</option></select></Field>
        <Field label="Region"><select className="field" value={region} onChange={(e) => { setRegion(e.target.value); setSchool(SCHOOLS[e.target.value][0]); }}>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select></Field>
        <Field label="Institution"><select className="field" value={school} onChange={(e) => setSchool(e.target.value)}>{SCHOOLS[region].map((s) => <option key={s}>{s}</option>)}</select></Field>
      </div>
      <div className="mt-4"><Field label="Or type the exact institution (overrides the list)"><input className="field" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="e.g., University of Navarra" /></Field></div>
      <div className="mt-4"><Field label="Programme / scholarship name"><input className="field" value={programme} onChange={(e) => setProgramme(e.target.value)} placeholder="MSc Public Health, Chevening Scholarship" /></Field></div>
      <div className="mt-4"><Field label="Your background & motivation"><textarea className="field" rows={7} value={background} onChange={(e) => setBackground(e.target.value)} placeholder="Your education and grades, relevant experience and achievements, why this programme and school, and your goals." /></Field></div>
      <Submit loading={loading} onClick={gen}>{loading ? "Drafting…" : "Generate letter (.docx)"}</Submit>
      {msg && <p className="mt-4 font-medium text-slate-700">{msg}</p>}
    </ToolShell>
  );
}

/* ---------- Job Search ---------- */
function Jobs() {
  const [role, setRole] = useState(""); const [discipline, setDiscipline] = useState(""); const [location, setLocation] = useState("");
  const [period, setPeriod] = useState("Any time"); const [experience, setExperience] = useState("Any"); const [workMode, setWorkMode] = useState("Any"); const [ngo, setNgo] = useState(true);
  const [results, setResults] = useState(null);
  const [loading, run] = useRun(async () => {
    if (!role.trim()) return; setResults(null);
    try { const r = await api.jobs({ role, discipline, location, period, experience, work_mode: workMode, include_ngo: ngo }); setResults(r.results || []); } catch { setResults([]); }
  });
  return (
    <ToolShell icon={I.jobs} title="Live Job Search" desc="Current openings across LinkedIn, Indeed, Glassdoor and ZipRecruiter, plus WHO, UNICEF, Gavi, the UN and other NGOs - every link verified.">
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
      {results && results.length > 0 && <ul className="mt-6 space-y-4">{results.map((j, i) => <LinkCard key={i} href={j.url} title={j.title} meta={`Source: ${j.source}`} body={j.snippet} />)}</ul>}
      {results && results.length === 0 && <p className="mt-6 text-slate-500">No verified openings this time. Try broader keywords, a different location, or a wider date range.</p>}
    </ToolShell>
  );
}
