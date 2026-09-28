"use client";
import { useState } from "react";
import Link from "next/link";
import HeroCarousel from "./HeroCarousel";
import { COUNTRIES } from "../lib/countries";
import { api } from "../lib/api";

export default function PilotWelcome({ onDone }) {
  const [name, setName] = useState("");
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [analytics, setAnalytics] = useState(false);
  const [remember, setRemember] = useState(false);
  function enter(event) {
    event.preventDefault();
    const user = { name: name.trim() || "Explorer", country: country === COUNTRIES[0] ? "" : country, analytics, participantId: crypto.randomUUID(), version: 2 };
    try {
      localStorage.removeItem("aca_user");
      sessionStorage.removeItem("aca_user");
      (remember ? localStorage : sessionStorage).setItem("aca_user", JSON.stringify(user));
    } catch { /* The workspace still works when browser storage is unavailable. */ }
    if (analytics) api.event({ event: "pilot_start", user_name: user.participantId, country: user.country, details: "pilot-v2" });
    onDone(user);
  }
  return <main id="main-content" className="onboarding">
    <HeroCarousel fill />
    <header className="site-header"><Link href="/" className="wordmark"><span className="brand-mark">a<span>↗</span></span><span>AfriCareer <b>AI</b><small>BY QUANTIUM INSIGHTS</small></span></Link><Link href="/" className="header-launch">← Back to home</Link></header>
    <div className="hero-layout">
      <div className="hero-copy"><p className="overline">A LITTLE DIRECTION. A WORLD OF POSSIBILITY.</p><h1>Your next chapter<br />starts <em>with you.</em></h1><p className="hero-description">You don’t need to have it all figured out. Bring a question, a goal, or a CV — and take one useful step forward.</p><div className="hero-facts"><div><strong>Your pace</strong><span>Choose the support you need</span></div><div><strong>Your voice</strong><span>Make every draft your own</span></div></div></div>
      <section className="journey-panel"><p className="overline">WELCOME TO THE FREE PILOT</p><h2>Make yourself at home.</h2><p>This is a browser workspace, not a secure account. No password or email needed.</p>
        <form onSubmit={enter} className="mt-6 space-y-4">
          <label className="block font-medium text-slate-700" htmlFor="pilot-name">What should we call you? <span className="font-normal">(optional)</span><input id="pilot-name" className="field mt-2" maxLength={60} autoComplete="nickname" value={name} onChange={e=>setName(e.target.value)} placeholder="First name or nickname" /></label>
          <label className="block font-medium text-slate-700" htmlFor="pilot-country">Country <span className="font-normal">(optional)</span><select id="pilot-country" className="field mt-2" value={country} onChange={e=>setCountry(e.target.value)}>{COUNTRIES.map(c=><option key={c}>{c}</option>)}</select></label>
          <label className="flex gap-3 items-start text-slate-600"><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} className="mt-1" /><span>Remember my preferences on this device. Leave off on a shared device.</span></label>
          <label className="flex gap-3 items-start text-slate-600"><input type="checkbox" checked={analytics} onChange={e=>setAnalytics(e.target.checked)} className="mt-1" /><span>Help improve the pilot with optional usage statistics: tool activity, country, response language, and a random participant ID. My name and documents are not included.</span></label>
          <div className="rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">Questions and documents you submit are processed by our AI and search providers to produce results. Avoid unnecessary sensitive details. <Link href="/privacy" className="underline text-[var(--brand)]">Read the privacy notice</Link>.</div>
          <button type="submit" className="btn-primary w-full">Open my workspace <span aria-hidden="true">↗</span></button>
          <p className="text-xs leading-relaxed text-slate-500">Free during the pilot. Review AI outputs before using them. <Link href="/terms" className="underline">Terms of use</Link></p>
        </form>
      </section>
    </div>
  </main>;
}
