import Link from "next/link";
import HeroCarousel from "../components/HeroCarousel";

function Icon({ path }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {path}
    </svg>
  );
}
const icons = {
  cv: <><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" /><path d="M9 13h6M9 17h4" /></>,
  letter: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>,
  book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
};

const FEATURES = [
  ["cv", "ATS-optimized CVs & resume analysis", "Upload a resume or answer five prompts. Get a premium, recruiter-ready CV with quantified achievements - and an ATS score with concrete fixes."],
  ["letter", "Cover, motivation & scholarship letters", "Researched cover letters for real jobs, plus motivation letters for undergraduate, PhD and scholarship applications - grounded in live research on the employer or school."],
  ["search", "Live jobs & scholarships", "Current openings across LinkedIn, Indeed, Glassdoor, plus WHO, UNICEF, Gavi, the UN and other NGOs. Every link is verified in real time."],
  ["book", "Verified learning links", "Curated free and paid courses from Coursera, edX, freeCodeCamp and more - each link checked live, so you never chase a broken or fake course."],
  ["globe", "Nine African languages", "Guidance in English, French, Swahili, Arabic, Hausa, Pidgin, Portuguese, Spanish and Amharic - meet learners where they are."],
  ["shield", "Grounded in real evidence", "Retrieval-augmented answers anchored in UNICEF, ILO, AfDB SEPA and UNESCO frameworks - advice that reflects real policy, not guesswork."],
];

const STEPS = [
  ["Tell us about you", "Answer a few simple prompts, upload a CV, or describe the role, school or scholarship you're targeting."],
  ["We research & generate", "The AI grounds every response in trusted frameworks and live web research on your target - no invented facts."],
  ["Apply with confidence", "Download a polished CV or letter, open verified job and course links, and act on a clear, personalized plan."],
];

const AUDIENCES = [
  ["Youth", "First-time jobseekers building a CV, exploring careers, and finding free skills to grow - no experience required."],
  ["Professionals", "Mid-career talent upgrading CVs, writing researched cover letters, and tracking live roles across companies and NGOs."],
  ["Students", "Applicants to undergraduate, master's, PhD and scholarship programmes, with motivation letters tailored to each school."],
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* NAV */}
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Quantium Insights" className="h-11 w-11 object-contain sm:h-12 sm:w-12" />
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              AfriCareer <span className="text-[var(--brand)]">AI</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#how" className="hover:text-slate-900">How it works</a>
            <a href="#who" className="hover:text-slate-900">Who it's for</a>
          </nav>
          <Link href="/app" className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--brand-dark)]">
            Launch app
          </Link>
        </div>
      </header>

      {/* HERO - full-bleed rotating photos behind the headline (UniPod style) */}
      <section className="relative overflow-hidden">
        <HeroCarousel fill />
        <div className="relative mx-auto max-w-4xl px-6 pb-28 pt-24 text-center sm:pb-36 sm:pt-32">
          <span className="inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-50 backdrop-blur">
            Free · Multilingual · Built for Africa
          </span>
          <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-lg sm:text-7xl">
            Career &amp; academic guidance,
            <span className="block bg-gradient-to-r from-blue-200 via-white to-indigo-200 bg-clip-text text-transparent">
              built for African talent
            </span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-blue-50/90 drop-shadow sm:text-xl">
            Build an ATS-ready CV, generate researched cover and motivation letters, search live jobs and
            scholarships, and find verified courses - all grounded in real evidence and available 24/7.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/app" className="btn-primary text-base">Get started free →</Link>
            <a href="#features" className="rounded-xl border border-white/40 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur transition hover:bg-white/20">Explore features</a>
          </div>
          <p className="mt-6 text-sm text-blue-100/80">No credit card · No signup barriers · Works on any phone</p>
        </div>
      </section>

      {/* STATS BAND */}
      <section className="relative z-10 mx-auto -mt-10 max-w-5xl px-6 pb-8">
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5 sm:grid-cols-4">
          {[["9", "African languages"], ["7", "AI-powered tools"], ["100%", "Verified links"], ["4", "Evidence frameworks"]].map(([n, l]) => (
            <div key={l} className="text-center">
              <div className="text-3xl font-extrabold text-slate-900">{n}</div>
              <div className="mt-1 text-sm text-slate-500">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Everything in one place</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">One assistant for your whole journey</h2>
          <p className="mt-4 text-slate-600">From your first CV to a PhD scholarship letter - every tool is grounded, verified, and free.</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(([ic, title, desc]) => (
            <div key={title} className="card group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[var(--brand)] transition group-hover:bg-[var(--brand)] group-hover:text-white">
                <Icon path={icons[ic]} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="border-y border-slate-100 bg-slate-50/60">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">How it works</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Three steps to a stronger application</h2>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {STEPS.map(([title, desc], i) => (
              <div key={title} className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand)] text-lg font-bold text-white">{i + 1}</div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AUDIENCES */}
      <section id="who" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Who it's for</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Made for youth, professionals &amp; students</h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {AUDIENCES.map(([title, desc]) => (
            <div key={title} className="card">
              <h3 className="text-xl font-bold text-slate-900">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EVIDENCE */}
      <section className="border-t border-slate-100 bg-slate-50/60">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Grounded in trusted, global evidence</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Every answer is retrieval-augmented from authoritative youth-employment and education frameworks.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-lg font-semibold text-slate-400">
            <span>UNICEF</span><span>ILO</span><span>AfDB · SEPA</span><span>UNESCO</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--brand)] to-indigo-600 px-8 py-16 text-center text-white shadow-2xl shadow-blue-600/20 sm:px-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Your next opportunity starts here</h2>
          <p className="mx-auto mt-4 max-w-xl text-blue-50">
            Free, multilingual, and built for African youth and professionals. Launch the app and get your first CV, letter, or job list in minutes.
          </p>
          <Link href="/app" className="mt-8 inline-flex rounded-xl bg-white px-7 py-3.5 font-semibold text-[var(--brand)] shadow-lg transition hover:-translate-y-0.5">
            Get started free →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-slate-500 sm:flex-row">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Quantium Insights" className="h-10 w-10 object-contain" />
            <span className="font-bold text-slate-800">AfriCareer <span className="text-[var(--brand)]">AI</span></span>
          </div>
          <span>© {new Date().getFullYear()} Quantium Insights LLC · Empowering African talent</span>
        </div>
      </footer>
    </main>
  );
}
