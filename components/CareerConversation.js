"use client";
import { useState } from "react";
import EvidencePanel from "./EvidencePanel";
import { api } from "../lib/api";

export default function CareerConversation({ lang, Markdown, FeedbackBar }) {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [goal, setGoal] = useState("");
  const [facts, setFacts] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function send(event) {
    event.preventDefault();
    if (!question.trim() || busy) return;
    const current = question.trim();
    setBusy(true); setError("");
    try {
      const history = messages.slice(-6).map(m => `${m.role}: ${m.text.slice(0, 1600)}`).join("\n\n");
      const prompt = `Career coaching conversation. Treat previous assistant messages as unverified suggestions, not facts. Ask a focused follow-up if information is missing. Latest user correction takes precedence.\nUSER-EDITED NOTEBOOK\nGoal: ${goal}\nFacts: ${facts}\nChosen next step: ${nextStep}\nRECENT CONVERSATION\n${history}\nCURRENT USER MESSAGE\n${current}`;
      const response = await api.assistant(prompt, lang);
      if (!response.text) throw new Error("No answer was returned. Please retry.");
      setMessages(prev => [...prev, { role: "You", text: current }, { role: "Adviser", text: response.text, evidence: response.evidence }]);
      setQuestion("");
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }
  function exportNotes() {
    const text = `AfriCareer conversation notes\n\nMy goal\n${goal}\n\nFacts I supplied\n${facts}\n\nMy next step\n${nextStep}\n\nConversation — AI suggestions need checking\n\n${messages.map(m => `${m.role}: ${m.text}`).join("\n\n")}`;
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = "AfriCareer_conversation.txt"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <section className="coach-space">
    <div className="coach-intro">
      <svg role="img" aria-label="Illustrated AI career adviser" viewBox="0 0 120 140" className="coach-portrait">
        <rect width="120" height="140" rx="22" fill="#153e43"/><circle cx="60" cy="49" r="24" fill="#ba805a"/>
        <path d="M35 48C25 8 95 5 86 50L76 28 47 32Z" fill="#162b30"/><path d="M20 140V110Q25 83 60 84Q95 83 100 110V140" fill="#d7eee6"/>
        <path d="M45 86L60 111 76 86" fill="#fff"/><circle cx="51" cy="48" r="2" fill="#193136"/><circle cx="70" cy="48" r="2" fill="#193136"/>
        <path d="M52 61Q60 66 68 61" fill="none" stroke="#663d2c" strokeWidth="2"/>
      </svg>
      <div><p className="overline">YOUR CAREER CONVERSATION</p><h1>Let’s work through your next step.</h1><p>An AI adviser for study, work and applications. Tell me what you want to change; we’ll build a practical plan together.</p><span className="coach-status">{busy ? "Preparing a response…" : "Text conversation · AI, not a human adviser"}</span></div>
    </div>
    <div className="coach-columns">
      <div className="coach-chat">
        {!messages.length && <div className="coach-empty"><h2>Where would you like to begin?</h2>{["Help me build my first CV", "Help me change careers", "Help me prepare a PhD application"].map(text => <button key={text} onClick={() => setQuestion(text)}>{text} →</button>)}</div>}
        <div role="log" aria-label="Career conversation" aria-live="polite" aria-busy={busy}>
          {messages.map((m, i) => <article key={i} className={`coach-message ${m.role === "You" ? "from-user" : ""}`}><strong>{m.role}</strong><Markdown>{m.text}</Markdown>{m.role === "Adviser" && <><EvidencePanel evidence={m.evidence} /><FeedbackBar tool="assistant" lang={lang} /></>}</article>)}
        </div>
        <form onSubmit={send}><label htmlFor="coach-question">Your message</label><textarea id="coach-question" className="field" rows={3} maxLength={2500} value={question} onChange={e => setQuestion(e.target.value)} placeholder="Tell me about your goal, or ask a follow-up…" required />
          <p className="coach-small">Your message, notebook and recent turns are sent to the AI. This session clears when you leave this tool. Download your notes to keep them.</p>
          {error && <p role="alert" className="text-red-700">{error}</p>}<button className="btn-primary" disabled={busy}>{busy ? "Thinking…" : "Send message →"}</button>
        </form>
      </div>
      <aside className="coach-notebook"><p className="overline">MY CAREER NOTEBOOK</p><h2>A plan you can own.</h2><p className="coach-small">These are your words. Edit them as your plans change.</p>
        <label htmlFor="coach-goal">My goal</label><textarea id="coach-goal" rows={2} maxLength={300} value={goal} onChange={e=>setGoal(e.target.value)} />
        <label htmlFor="coach-facts">Facts I want the adviser to use</label><textarea id="coach-facts" rows={5} maxLength={2000} value={facts} onChange={e=>setFacts(e.target.value)} placeholder="Experience, location, available time, budget…" />
        <label htmlFor="coach-next">My chosen next step</label><textarea id="coach-next" rows={3} maxLength={500} value={nextStep} onChange={e=>setNextStep(e.target.value)} />
        <button className="btn-ghost" onClick={exportNotes}>Download my notes</button><p className="coach-small">Check source documents and application requirements before acting. Voice and live video are not enabled in this version.</p>
      </aside>
    </div>
  </section>;
}
