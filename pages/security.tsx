import Head from 'next/head'

export default function Page() {
  const NAME = "SaaSpend";
  return (
    <>
      <Head>
        <title>{NAME} — Security & Compliance</title>
        <meta name="description" content={NAME + " — How SaaSpend handles your data and the compliance posture it maintains."} />
      </Head>
      <div className="min-h-screen bg-slate-50 text-slate-800">
        <header className="border-b border-slate-200 bg-white">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="font-bold text-slate-900">{NAME}</a>
            <nav className="hidden md:flex gap-6 text-sm font-semibold text-slate-500">
              <a href="/use-cases" className="hover:text-slate-900">Use cases</a>
              <a href="/integrations" className="hover:text-slate-900">Integrations</a>
              <a href="/how-it-works" className="hover:text-slate-900">How it works</a>
              <a href="/security" className="hover:text-slate-900">Security</a>
              <a href="/blog" className="hover:text-slate-900">Blog</a>
            </nav>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-6 py-14">
          <h1 className="text-3xl font-bold text-slate-900">Security &amp; Compliance</h1>
          <p className="mt-3 text-slate-600">List your team's SaaS tools (one per line with monthly cost); get a spend audit that flags duplicate categories, forgotten tools, and a suggested savings number. For SMB ops and finance managers tracking tool sprawl.</p>
          <h2 className="mt-8 text-xl font-semibold text-slate-900">What we handle</h2>
          <p className="mt-2 text-slate-600">Tool names and monthly costs you submit (your SaaS inventory), plus team size and org context used to estimate savings. We do NOT ask for bank, card, or login credentials, and do not connect to your billing provider unless you explicitly configure a read-only integration. We do not train public models on your submissions without explicit consent.</p>
          <h2 className="mt-6 text-xl font-semibold text-slate-900">Data handling commitments</h2>
          <ul className="mt-2 list-disc pl-6 text-slate-600">
            <li>Input is used only to generate your spend report (GDPR Art.5 — data minimization).</li>
            <li>We minimize retained data and avoid storing secrets longer than needed.</li>
            <li>Transfers use standard encryption in transit (TLS) (GDPR Art.32 — security of processing).</li>
            <li>Access is restricted to the account that submitted the data.</li>
          </ul>
          <h2 className="mt-6 text-xl font-semibold text-slate-900">Compliance posture</h2>
          <p className="mt-2 text-slate-600">GDPR: lawful basis is contract / legitimate interest for processing your own submitted business data (Art.6). We support data deletion on request (right to erasure, Art.17). We are not a certified auditor or financial advisor.</p>
          <div className="mt-8 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>Honesty note:</strong> {NAME} is a decision-support tool that helps you spot likely duplicate categories and forgotten tools. It does <strong>not</strong> guarantee compliance, 100% coverage, that you will never miss a subscription, or that listed savings are realized. Treat its output as decision-support, not financial or legal advice.
          </div>
          <h2 className="mt-6 text-xl font-semibold text-slate-900">Subprocessors</h2>
          <p className="mt-2 text-slate-600">We rely on our hosting provider (Vercel) and payment processor (Waffo). No data is sold to third parties (OWASP Top 10 — secure defaults).</p>
        </main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="max-w-5xl mx-auto px-6 py-8 text-sm text-slate-500 flex flex-wrap gap-6">
            <a href="/security" className="hover:text-slate-900">Security</a>
            <a href="/use-cases" className="hover:text-slate-900">Use cases</a>
            <a href="/integrations" className="hover:text-slate-900">Integrations</a>
            <a href="/how-it-works" className="hover:text-slate-900">How it works</a>
            <a href="/blog" className="hover:text-slate-900">Blog</a>
          </div>
        </footer>
      </div>
    </>
  )
}
