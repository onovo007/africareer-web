"use client";
export default function EvidencePanel({ evidence }) {
  if (!evidence) return <p className="mt-3 text-sm text-amber-800">Evidence details were not returned by this server. Treat this response as unverified guidance.</p>;
  return <details className="mt-4 rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm text-slate-700">
    <summary className="cursor-pointer font-semibold text-teal-950">Evidence behind this answer · {evidence.label}</summary>
    <p className="mt-3">{evidence.explanation}</p>
    <p className="mt-2">Claim-by-claim support: {evidence.claim_support}. {evidence.link_count > 0 ? `${evidence.link_count} discovery links passed a reachability check; their content is not verified.` : ""}</p>
    <ul className="mt-3 space-y-3">{evidence.sources?.map((s,i)=><li key={i}>
      {s.url ? <a className="font-semibold underline" href={s.url} target="_blank" rel="noopener noreferrer">{s.title}</a> : <strong>{s.title}</strong>}
      <p>{s.scope}{s.reviewed_on ? ` · Reviewed ${s.reviewed_on}` : ""}</p><p>{s.limits}</p>
    </li>)}</ul>
    <a className="mt-3 inline-block underline" href="/knowledge">Browse our reference library and review policy →</a>
  </details>;
}
