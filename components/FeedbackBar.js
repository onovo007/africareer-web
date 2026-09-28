"use client";
import { useState, useRef } from "react";
import { api } from "../lib/api";
import { readProfile } from "../lib/profile";
export default function FeedbackBar({ tool, lang = "English" }) {
 const pending=useRef(null);
 const [rating,setRating]=useState(null), [comment,setComment]=useState("");
 const [state,setState]=useState("idle"), [error,setError]=useState("");
 async function send() {
  if (!rating || state === "sending") return;
  setState("sending"); setError("");
  const user=readProfile();
  try {
   if (!pending.current) pending.current={request_id:crypto.randomUUID(),rating,tool:tool || "",comment,user_name:user?.analytics ? user.participantId : "",country:user?.analytics ? user.country : "",language:lang};
   const result=await api.feedback(pending.current);
   if (!result.ok) throw new Error("Feedback could not be saved. Please try again later.");
   setState("sent");
  } catch (e) { setError(e.message); setState("idle"); }
 }
 if(state === "sent") return <p role="status" className="mt-5 border-t pt-4 text-sm text-teal-800">Thank you — your feedback was saved.</p>;
 return <div className="mt-5 border-t border-slate-200 pt-4 text-sm">
  <div className="flex flex-wrap items-center gap-3"><span>Was this useful for your next step?</span>{[["up","Helpful"],["down","Needs improvement"]].map(([value,label])=><button key={value} disabled={state === "sending"} aria-pressed={rating === value} onClick={()=>{setRating(value); pending.current=null;}} className={`rounded-lg border px-3 py-2 ${rating === value ? "border-teal-700 bg-teal-50 text-teal-900" : "border-slate-300"}`}>{label}</button>)}</div>
  {rating && <div className="mt-3"><label className="block text-xs text-slate-600">What worked, or what should change? (optional)<textarea value={comment} maxLength={1000} onChange={e=>{setComment(e.target.value); pending.current=null;}} disabled={state === "sending"} rows={2} className="field mt-2" /></label><p className="mt-2 text-xs text-slate-500">Sent to the AfriCareer team. Please leave out personal or sensitive details.</p><button disabled={state === "sending"} onClick={send} className="btn-primary mt-3 text-sm">{state === "sending" ? "Saving…" : "Send feedback"}</button></div>}
  {error && <p role="alert" className="mt-3 text-red-700">{error}</p>}
 </div>;
}
