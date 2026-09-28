import Link from "next/link";
import HeroCarousel from "../components/HeroCarousel";
const journeys = [
 ["01", "Build my career", "Turn your strengths into a practical plan.", "guidance"],
 ["02", "Strengthen my application", "Improve your CV and tell your story clearly.", "resume"],
 ["03", "Find my next opportunity", "Explore jobs that match your direction.", "jobs"],
 ["04", "Explore study & scholarships", "Find programmes and prepare a motivation letter.", "motivation"],
];
const features = [
 ["Career direction", "A starting point that fits your life.", "Explore your interests, experience and ambitions. Get a practical roadmap, whether you are starting out or changing direction.", "guidance", "↗"],
 ["CVs & applications", "Your experience, expressed clearly.", "Review your résumé, build an editable CV, and draft a tailored cover letter. Keep every achievement true to your experience.", "resume", "≡"],
 ["Jobs & learning", "Make your next move an informed one.", "Discover job boards, courses and study opportunities. Check eligibility, fees and closing dates on the provider’s website.", "learning", "◎"],
];
export default function Home() {
 return <main id="main-content">
  <div className="home-masthead">
   <HeroCarousel fill />
   <header className="site-header">
    <Link href="/" className="wordmark"><span className="brand-mark">a<span>↗</span></span><span>AfriCareer <b>AI</b><small>BY QUANTIUM INSIGHTS</small></span></Link>
    <nav aria-label="Main navigation"><a href="#tools">The tools</a><a href="#how">How it works</a><a href="#pilot">The pilot</a></nav>
    <Link href="/app" className="header-launch">Open workspace <span aria-hidden="true">↗</span></Link>
   </header>
   <section className="hero-layout" aria-labelledby="hero-title">
    <div className="hero-copy">
     <p className="overline"><span className="status-dot" /> AFRICAN TALENT. POSSIBILITIES AHEAD.</p>
     <h1 id="hero-title">Your ambition.<br />A clearer <em>way forward.</em></h1>
     <p className="hero-description">From your first CV to your next career move. Find direction, strengthen your applications, and explore opportunities with guidance built around you.</p>
     <div className="hero-actions"><Link href="/app?tool=guidance" className="mint-button">Find my starting point <span aria-hidden="true">↗</span></Link><a href="#how" className="quiet-link">See how it works <span aria-hidden="true">↓</span></a></div>
     <div className="hero-facts"><div><strong>9</strong><span>response languages</span></div><div><strong>One</strong><span>career workspace</span></div><div><strong>Free</strong><span>during the pilot</span></div></div>
     <p className="hero-note">For students, first-time jobseekers and professionals.</p>
    </div>
    <div className="journey-panel">
     <p className="overline">START WHERE YOU ARE</p><h2>What’s your next step?</h2><p>Choose a goal. We’ll help you get moving.</p>
     <div className="journey-list">{journeys.map(([n,title,desc,tool]) => <Link key={tool} href={`/app?tool=${tool}`} className="journey-link"><span className="journey-number">{n}</span><span><strong>{title}</strong><small>{desc}</small></span><span className="journey-arrow" aria-hidden="true">↗</span></Link>)}</div>
     <div className="panel-note"><span aria-hidden="true">◈</span> No payment needed. Your feedback shapes what comes next.</div>
    </div>
   </section>
   <div className="hero-bottom"><span>LOCAL CONTEXT. GLOBAL OPPORTUNITIES.</span><span>EXPLORE WHAT’S POSSIBLE <span aria-hidden="true">↓</span></span></div>
  </div>
  <section id="tools" className="editorial-section">
   <div className="section-intro"><div><p className="overline">PRACTICAL SUPPORT, AT EVERY STAGE</p><h2>Big ambitions.<br /><em>Manageable next steps.</em></h2></div><p>You bring the experience and the aspirations. AfriCareer AI helps you put them into words, a plan, and action.</p></div>
   <div className="feature-grid">{features.map(([tag,title,desc,tool,icon]) => <article className="feature-tile" key={tag}><span className="feature-icon" aria-hidden="true">{icon}</span><p className="overline">{tag}</p><h3>{title}</h3><p>{desc}</p><Link href={`/app?tool=${tool}`}>Explore the tool <span aria-hidden="true">↗</span></Link></article>)}</div>
  </section>
  <section id="how" className="how-section"><div className="editorial-section"><p className="overline">FROM A QUESTION TO A NEXT STEP</p><h2>A little context goes a long way.</h2><div className="steps-grid">{[["01","Tell us what you need","Describe your goal, answer a few prompts, or upload a résumé. Share only what the task needs."],["02","Explore your options","Get AI guidance supported by available reference material and web research. Ask questions and compare possibilities."],["03","Make it your own","Review the facts, edit your document, and choose a next step. You stay in charge of every application."]].map(([n,t,d]) => <article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></div></section>
  <section className="editorial-section evidence-section"><div><p className="overline">DESIGNED TO HELP YOU THINK AHEAD</p><h2>Useful guidance.<br /><em>Room for your judgment.</em></h2></div><div><p>We are auditing source documents from AfDB, UNICEF, ILO and UNESCO for traceable career and education guidance. General AI advice should not be treated as verified policy evidence. These organisations do not endorse AfriCareer AI.</p><p>AI can miss context or make mistakes. A reachable link does not confirm that a job is open or a scholarship is suitable. Review your documents and check important details with the original provider.</p><Link href="/privacy">Understand how your information is used ↗</Link></div></section>
  <section id="pilot" className="pilot-section"><div><p className="overline">HELP SHAPE AFRICAREER AI</p><h2>Your next chapter.<br /><em>Our next improvement.</em></h2><p>We’re preparing AfriCareer AI with feedback from people who use it. Try the tools during the free pilot and tell us what helped, what was confusing, and what you need next.</p><Link href="/app" className="mint-button">Explore the pilot workspace ↗</Link></div><div className="pilot-details"><span>THE PILOT EXPERIENCE</span><p>Try a real career or study task.</p><p>Review the result in your own context.</p><p>Use the feedback buttons to help us improve.</p><small>No card required. No payment during the pilot.</small></div></section>
  <footer className="site-footer"><Link href="/" className="footer-brand">AfriCareer AI</Link><span>Built for the possibilities ahead.</span><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><a href="mailto:dramobionovo@quantiuminsights.com">Contact</a></div><small>© {new Date().getFullYear()} Quantium Insights LLC</small></footer>
 </main>;
}
