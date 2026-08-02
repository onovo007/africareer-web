import Link from "next/link";

export const metadata = {
  title: "Privacy Policy · AfriCareer AI",
  description: "How AfriCareer AI collects, uses, and protects your data.",
};

function Section({ title, children }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-slate-600">{children}</div>
    </section>
  );
}

export default function Privacy() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-slate-100">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-extrabold tracking-tight text-slate-900">
            AfriCareer <span className="text-[var(--brand)]">AI</span>
          </Link>
          <Link href="/app" className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--brand-dark)]">Launch app</Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-400">Last updated: July 2026</p>
        <p className="mt-6 text-sm leading-relaxed text-slate-600">
          AfriCareer AI is a free service operated by Quantium Insights LLC. We keep data collection to the minimum needed
          to run and improve the service. This policy explains what we collect, why, and your choices.
        </p>

        <Section title="1. What we collect">
          <ul className="list-disc space-y-1 pl-5">
            <li><strong>Sign-in details:</strong> your name and country, and your email address if you choose to provide it (email is optional).</li>
            <li><strong>Usage events:</strong> which tools you use, the language you select, and your country — so we can understand and improve the service.</li>
            <li><strong>Content you submit:</strong> the answers, questions, or documents (e.g. a résumé) you provide are processed to generate your results.</li>
          </ul>
        </Section>

        <Section title="2. How we use it">
          <p>We use this information solely to provide the features you request, to understand overall usage, and to improve the quality of guidance. Aggregated usage helps us decide which features and languages to prioritise.</p>
        </Section>

        <Section title="3. What we do NOT do">
          <p>We do <strong>not</strong> sell your data, share it externally for marketing, or use it for advertising. Access to usage data is limited to the AfriCareer AI team.</p>
        </Section>

        <Section title="4. AI processing & third parties">
          <p>
            To generate responses, the content you submit is sent to trusted processors — OpenAI (for the AI model) and,
            for live search, Tavily. Usage analytics are stored with Supabase. Please avoid submitting sensitive personal
            information (such as national ID numbers or financial details) that you would not want processed by these services.
          </p>
        </Section>

        <Section title="5. Data retention">
          <p>Uploaded documents are processed to produce your output and are not stored as part of your profile. Usage events are retained to support service analytics and improvement.</p>
        </Section>

        <Section title="6. Your choices">
          <p>Providing your email is optional. You can use the core tools with just a name and country. If you would like your usage records removed, contact us at the address below.</p>
        </Section>

        <Section title="7. Contact">
          <p>Questions about this policy? Email <a className="font-medium text-[var(--brand)] hover:underline" href="mailto:amobiandrewonovo@gmail.com">amobiandrewonovo@gmail.com</a> (Quantium Insights LLC).</p>
        </Section>

        <div className="mt-10 flex gap-4 border-t border-slate-100 pt-6 text-sm">
          <Link href="/terms" className="font-medium text-[var(--brand)] hover:underline">Terms of Use →</Link>
          <Link href="/" className="text-slate-400 hover:text-slate-600">← Back to home</Link>
        </div>
      </article>
    </main>
  );
}
