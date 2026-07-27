"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "../../lib/api";
import { SCHOOLS, REGIONS } from "../../lib/schools";

const TABS = [
  ["about", "About"],
  ["guidance", "Career Guidance"],
  ["learning", "Learning Resources"],
  ["assistant", "AI Assistant"],
  ["resume", "Resume Analysis"],
  ["motivation", "Motivation Letters"],
  ["jobs", "Job Search"],
];

export default function AppPage() {
  const [tool, setTool] = useState("about");
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

      <div className="border-b border-slate-200 bg-white px-4 py-3 md:hidden">
        <div className="flex gap-2 overflow-x-auto">
          {TABS.map(([k, l]) => (
            <button key={k} onClick={() => setTool(k)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium ${tool === k ? "bg-[var(--brand)] text-white" : "bg-slate-100 text-slate-600"}`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl gap-8 px-6 py-8">
        <aside className="hidden w-56 shrink-0 md:block">
          <nav className="sticky top-24 space-y-1">
            {TABS.map(([k, l]) => (
              <button key={k} onClick={() => setTool(k)}
                className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${tool === k ? "bg-blue-50 text-[var(--brand)]" : "text-slate-600 hover:bg-slate-100"}`}>{l}</button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div key={tool} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
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

/* ---------- shared UI ---------- */
function Head({ title, desc }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
      {desc && <p className="mt-2 text-slate-600">{desc}</p>}
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
    <button onClick={onClick} disabled={loading}
      className={`${secondary ? "btn-ghost" : "btn-primary"} mt-1 disabled:opacity-60`}>
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
function Result({ children }) {
  return <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">{children}</div>;
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

/* ---------- About ---------- */
const ABOUT_MD = `
## About AfriCareer AI
**AfriCareer AI** is an AI-powered career and academic guidance platform for African youth and professionals.

### Mission
Empower African youth and professionals with free, high-quality, accessible career and academic services.

### Key Features
- **9 Languages:** English, French, Swahili, Arabic, Hausa, Pidgin, Portuguese, Spanish, Amharic
- **ATS-Optimized CV Builder & Resume Analysis** — clean, recruiter-ready output
- **Cover, Motivation & Scholarship Letters** — grounded in live research on the employer or school
- **Live Job Search** — current roles across job boards and NGOs / international organizations
- **Verified Learning Links** — free and paid courses, checked live
- **Real-time Opportunity & Scholarship Search** — current openings with requirements

### Knowledge Base
Grounded in authoritative frameworks and best-practice guides: **AfDB SEPA**, **UNICEF Education Strategy**, **ILO Global Employment Trends for Youth**, and **UNESCO** — plus motivation-letter, scholarship and PhD best practices.

### Developer
**Dr. Amobi Andrew Onovo** — PhD Global Health, MPH, PGDip Data Science · Quantium Insights LLC

### Safety & Ethics
Focused, appropriate guidance; no inappropriate content; culturally appropriate advice for the African context; evidence-based recommendations from trusted sources.
`;
function About() {
  return <div><Head title="About AfriCareer AI" /><Markdown>{ABOUT_MD}</Markdown></div>;
}

/* ---------- Career Guidance ---------- */
function Guidance() {
  const [answers, setAnswers] = useState("");
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); const [city, setCity] = useState(""); const [linkedin, setLinkedin] = useState("");
  const [roadmap, setRoadmap] = useState(""); const [cvMsg, setCvMsg] = useState("");
  const [showContact, setShowContact] = useState(false);
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
    <div>
      <Head title="Career Guidance & CV Builder" desc="Answer five simple prompts to get a tailored roadmap — and a premium, ATS-ready CV built from the same answers." />
      <button onClick={() => setShowContact((s) => !s)} className="mb-4 text-sm font-medium text-[var(--brand)]">
        {showContact ? "▾ " : "▸ "}Contact details (used on your CV)
      </button>
      {showContact && (
        <div className="mb-5 grid gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2">
          <Field label="Full name"><input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Amina Bello" /></Field>
          <Field label="Email"><input className="field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="amina@email.com" /></Field>
          <Field label="Phone"><input className="field" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 800 000 0000" /></Field>
          <Field label="City, Country"><input className="field" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Kano, Nigeria" /></Field>
          <div className="sm:col-span-2"><Field label="LinkedIn / Portfolio (optional)"><input className="field" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="linkedin.com/in/aminabello" /></Field></div>
        </div>
      )}
      <Label>Answer these 5 prompts</Label>
      <textarea className="field" rows={8} value={answers} onChange={(e) => setAnswers(e.target.value)}
        placeholder={"1. What are you interested in?\n2. What are you good at / your skills?\n3. What experience do you have (any kind)?\n4. Your education?\n5. What job or goal do you want?"} />
      <div className="mt-2 flex flex-wrap gap-3">
        <Submit loading={gLoading} onClick={getGuidance}>{gLoading ? "Preparing…" : "Get career guidance"}</Submit>
        <Submit loading={cvLoading} onClick={genCv} secondary>{cvLoading ? "Building…" : "Generate premium CV (.docx)"}</Submit>
      </div>
      {cvMsg && <p className="mt-4 font-medium text-slate-700">{cvMsg}</p>}
      {roadmap && <Result><h3 className="text-lg font-semibold text-slate-900">Your Career Roadmap</h3><Markdown>{roadmap}</Markdown></Result>}
    </div>
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
    <div>
      <Head title="Learning Resources" desc="Verified courses matched to your goals, with your free-or-paid choice enforced. Every link is checked live." />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-3"><Field label="What do you want to learn?"><input className="field" value={interest} onChange={(e) => setInterest(e.target.value)} placeholder="data analysis, solar installation, tailoring & small business" /></Field></div>
        <Field label="Cost preference"><select className="field" value={cost} onChange={(e) => setCost(e.target.value)}><option>Free &amp; Paid</option><option>Free only</option><option>Paid only</option></select></Field>
        <Field label="Your level"><select className="field" value={level} onChange={(e) => setLevel(e.target.value)}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></Field>
      </div>
      <Submit loading={loading} onClick={run}>{loading ? "Finding…" : "Find courses"}</Submit>
      {results && results.length > 0 && <ul className="mt-6 space-y-4">{results.map((c, i) => <LinkCard key={i} href={c.url} title={c.title} meta={[c.provider, c.cost, c.level, c.duration].filter(Boolean).join(" · ")} body={c.why} />)}</ul>}
      {results && results.length === 0 && <p className="mt-6 text-slate-500">No results. Try a broader topic.</p>}
    </div>
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
    <div>
      <Head title="AI Career Assistant" desc="Ask anything about careers, education, job search, or scholarships. Answers are grounded in UNICEF, ILO, AfDB and UNESCO frameworks." />
      <Label>Your question</Label>
      <textarea className="field" rows={4} value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g., What digital skills should I build for a data role in Lagos?" />
      <Submit loading={loading} onClick={run}>{loading ? "Thinking…" : "Ask the assistant"}</Submit>
      {out && <Result><Markdown>{out}</Markdown></Result>}
    </div>
  );
}

/* ---------- Resume Analysis ---------- */
function Resume() {
  const [file, setFile] = useState(null); const [city, setCity] = useState(""); const [extra, setExtra] = useState("");
  const [resumeText, setResumeText] = useState(""); const [feedback, setFeedback] = useState("");
  const [position, setPosition] = useState(""); const [company, setCompany] = useState("");
  const [cvMsg, setCvMsg] = useState(""); const [clMsg, setClMsg] = useState("");
  const [loading, analyze] = useRun(async () => {
    if (!file) return; setFeedback(""); setCvMsg(""); setClMsg("");
    try {
      const ex = await api.extractText(file);
      const text = ex.text || ""; setResumeText(text);
      const r = await api.analyzeResume({ resume_text: text, city, additional_info: extra });
      setFeedback(r.text || "");
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
    <div>
      <Head title="Professional Resume Analysis" desc="Upload your résumé for expert feedback grounded in the African job market — then generate an improved CV and a researched cover letter." />
      <Field label="Upload your résumé (PDF, DOCX, TXT)">
        <input type="file" accept=".pdf,.docx,.txt" onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-[var(--brand)]" />
      </Field>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Your city (optional)"><input className="field" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Lagos, Nairobi, Accra" /></Field>
        <Field label="Additional info (optional)"><input className="field" value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="Target industry, preferred roles" /></Field>
      </div>
      <Submit loading={loading} onClick={analyze}>{loading ? "Analyzing…" : "Analyze résumé"}</Submit>
      {feedback && (
        <>
          <Result><h3 className="text-lg font-semibold text-slate-900">Your Résumé Analysis</h3><Markdown>{feedback}</Markdown></Result>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
            <h3 className="font-semibold text-slate-900">Generate premium documents</h3>
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
    </div>
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
  const [custom, setCustom] = useState("");
  const [programme, setProgramme] = useState("");
  const [background, setBackground] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, gen] = useRun(async () => {
    const inst = custom.trim() || (school.startsWith("Other") ? "" : school);
    if (!inst || !programme.trim() || !background.trim()) return; setMsg("");
    try { await api.motivationLetter({ category, school: inst, programme, background }); setMsg("✓ Motivation letter downloaded (.docx)."); }
    catch { setMsg("Something went wrong. Please try again."); }
  });
  return (
    <div>
      <Head title="Motivation & Scholarship Letters" desc="Generate a strong letter for a university or scholarship application — grounded in your real background and live research on the school." />

      <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
        <h3 className="font-semibold text-slate-900">Find live opportunities</h3>
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
    </div>
  );
}

/* ---------- Job Search ---------- */
function Jobs() {
  const [role, setRole] = useState(""); const [discipline, setDiscipline] = useState(""); const [location, setLocation] = useState("");
  const [period, setPeriod] = useState("Any time"); const [experience, setExperience] = useState("Any"); const [workMode, setWorkMode] = useState("Any");
  const [ngo, setNgo] = useState(true);
  const [results, setResults] = useState(null);
  const [loading, run] = useRun(async () => {
    if (!role.trim()) return; setResults(null);
    try { const r = await api.jobs({ role, discipline, location, period, experience, work_mode: workMode, include_ngo: ngo }); setResults(r.results || []); } catch { setResults([]); }
  });
  return (
    <div>
      <Head title="Live Job Search" desc="Current openings across LinkedIn, Indeed, Glassdoor and ZipRecruiter, plus WHO, UNICEF, Gavi, the UN and other NGOs. Every link is verified." />
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
    </div>
  );
}
