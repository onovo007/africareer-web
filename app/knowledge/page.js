"use client";
import {useEffect,useState} from 'react';
import {api} from '../../lib/api';
export default function Knowledge(){
 const [sources,setSources]=useState([]),[error,setError]=useState('');
 useEffect(()=>{api.knowledge().then(r=>setSources(r.sources||[])).catch(e=>setError(e.message));},[]);
 return <main className="mx-auto max-w-4xl px-6 py-12 text-slate-800"><a className="text-teal-800 underline" href="/app">← Back to AfriCareer</a>
 <h1 className="mt-8 text-4xl font-bold">References you can inspect.</h1>
 <p className="mt-5">Our starter library contains short notes reviewed against primary publisher pages. It is not a complete copy of the organisations’ publications. A source is supplied only when it matches the question; expired reviews are excluded.</p>
 <p className="mt-3">The evidence indicator describes the references supplied to the AI. It is not an accuracy score, an endorsement, or a guarantee that every claim is supported. Local licensing, current vacancies and programme rules still need checking.</p>
 <p className="mt-3">We keep each note’s source, scope, limitations, review date and integrity hash. Programme-specific rules take precedence over general policy. We review changing pages monthly; corrections can be sent using the feedback control beside an answer.</p>
 {error&&<p role="alert" className="mt-6 text-red-700">{error}</p>}
 <div className="mt-8 space-y-5">{sources.map(s=><article key={s.id} className="rounded-xl border border-slate-200 bg-white p-6"><p className="text-xs font-semibold uppercase text-teal-800">{s.active?'Available for retrieval':'Review overdue — excluded'}</p><h2 className="mt-2 text-xl font-bold"><a className="underline" href={s.url} target="_blank" rel="noopener noreferrer">{s.title}</a></h2><p className="mt-3">{s.note}</p><p className="mt-3 text-sm"><strong>Scope:</strong> {s.scope}</p><p className="mt-2 text-sm"><strong>Limits:</strong> {s.limits}</p><p className="mt-3 text-xs text-slate-500">Section: {s.section} · Reviewed {s.reviewed_on} · Review due {s.review_due}</p></article>)}</div>
 </main>;
}
