"use client";
import { useState } from "react";
import { api } from "../lib/api";

const names={full_name:'Full name',credentials:'Qualifications after your name',contact_line:'Contact details',professional_summary:'Professional summary',selected_achievements:'Selected achievements',core_competencies:'Core skills',work_experience:'Experience and volunteering',education:'Education',publications:'Publications',projects:'Projects',certifications:'Training and certifications',technical_skills:'Technical skills',languages:'Languages',title:'Title',company:'Organisation',location:'Location',dates:'Dates',bullets:'Details',degree:'Qualification',institution:'Institution',description:'Description'};
function Editor({ value, path, label, change }) {
  if(typeof value==='boolean') return null;
  if(typeof value==='string') return <label className="block text-sm font-medium text-slate-700">{label}<textarea className="field mt-1" rows={value.length>150?4:2} maxLength={4000} value={value} onChange={e=>change(path,e.target.value)}/></label>;
  if(Array.isArray(value)) return value.length ? <fieldset className="space-y-3 rounded-xl border border-slate-200 p-4"><legend className="px-1 font-semibold">{label}</legend>{value.map((item,i)=><Editor key={i} value={item} path={[...path,i]} label={`${label} ${i+1}`} change={change}/>)}</fieldset> : null;
  return <div className="space-y-3">{Object.entries(value).map(([key,item])=><Editor key={key} value={item} path={[...path,key]} label={names[key]||key} change={change}/>)}</div>;
}
export default function CvDraftEditor({ draft }) {
  const [cv,setCv]=useState(draft.cv); const [confirmed,setConfirmed]=useState(false);
  const [busy,setBusy]=useState(false); const [message,setMessage]=useState(''); const [error,setError]=useState('');
  function change(path,value){setCv(old=>{const next=structuredClone(old);let target=next;for(const key of path.slice(0,-1))target=target[key];target[path.at(-1)]=value;return next;});setConfirmed(false);setMessage('');}
  async function download(){if(!confirmed)return;setBusy(true);setError('');setMessage('');try{await api.cvDocument({cv,supplied_facts:draft.supplied_facts,confirmed});setMessage('Your reviewed CV downloaded. Check the layout in Word before sending it.');}catch(e){setError(e.message);}finally{setBusy(false);}}
  return <section className="mt-6 space-y-4 rounded-2xl border border-teal-200 bg-white p-5" aria-label="Review your CV">
    <h3 className="text-xl font-bold text-slate-900">Review, edit, then download</h3>
    <p className="text-sm text-slate-600">{draft.review_notice} This is a content editor; the Word file uses a single-column layout. It is not an employer ATS test.</p>
    <details className="rounded-xl bg-slate-50 p-4"><summary className="cursor-pointer font-semibold">Compare with your original facts</summary><p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{draft.supplied_facts}</p></details>
    <Editor value={cv} path={[]} label="CV" change={change}/>
    <p className="text-sm text-slate-600">If you need to add new achievements or numbers, update your original answers or résumé and generate again.</p>
    <label className="flex items-start gap-2 text-sm"><input className="mt-1" type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>I checked the facts, dates, qualifications and skill levels against my own records.</label>
    <button className="btn-primary disabled:opacity-50" disabled={!confirmed||busy} onClick={download}>{busy?'Preparing download…':'Download reviewed CV (.docx)'}</button>
    {error&&<p role="alert" className="text-red-700">{error}</p>}{message&&<p role="status" className="text-teal-800">{message}</p>}
  </section>;
}
