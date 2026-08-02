"use client";

import { useState } from "react";
import { api } from "../lib/api";

// Lightweight 👍/👎 + optional comment shown under an AI answer. Logs to the same
// Supabase analytics table (event="feedback") so it appears in the /admin dashboard.
export default function FeedbackBar({ tool, lang = "English" }) {
  const [rating, setRating] = useState(null);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("aca_user") || "null") || {}; } catch { return {}; }
  })();

  const send = (r, c = "") => {
    api.feedback({
      rating: r,
      tool: tool || "",
      comment: c,
      user_name: user.name || "",
      country: user.country || "",
      language: user.language || lang,
    });
  };

  const pick = (r) => {
    setRating(r);
    send(r);
    if (r === "down") setShowComment(true);
    else setSent(true);
  };

  if (sent) return <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400">Thanks for your feedback 🙏</p>;

  return (
    <div className="mt-4 border-t border-slate-100 pt-3 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-slate-500">Was this helpful?</span>
        <button
          onClick={() => pick("up")}
          aria-label="Helpful"
          className={`rounded-lg border px-2.5 py-1 transition ${rating === "up" ? "border-green-300 bg-green-50" : "border-slate-200 hover:bg-slate-50"}`}
        >👍</button>
        <button
          onClick={() => pick("down")}
          aria-label="Not helpful"
          className={`rounded-lg border px-2.5 py-1 transition ${rating === "down" ? "border-red-300 bg-red-50" : "border-slate-200 hover:bg-slate-50"}`}
        >👎</button>
      </div>
      {showComment && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What could be better? (optional)"
            className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-blue-100"
          />
          <button
            onClick={() => { send("down", comment); setSent(true); }}
            className="rounded-lg bg-[var(--brand)] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[var(--brand-dark)]"
          >Send</button>
        </div>
      )}
    </div>
  );
}
