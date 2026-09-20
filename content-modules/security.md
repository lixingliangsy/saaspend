# SaaSpend — Security & Compliance

SaaSpend is a B2B SaaS-spend tool. It handles business financial data (subscription
names, monthly costs, team size). This page states how that data is handled.

## What we handle
- Tool names and monthly costs you submit (your SaaS inventory).
- Team size and org context used to estimate savings.
- We do NOT ask for bank, card, or login credentials. We do not connect to your
  billing provider unless you explicitly configure a read-only integration.
- We do not train public models on your submissions without explicit consent.

## Data handling commitments
- Input is used only to generate your spend report. ref: GDPR Art.5 (data minimization)
- We minimize retained data and avoid storing secrets longer than needed.
- Transfers use standard encryption in transit (TLS). ref: GDPR Art.32 (security of processing)
- Access is restricted to the account that submitted the data.

## Compliance posture
- GDPR: lawful basis is contract / legitimate interest for processing your own
  submitted business data. ref: GDPR Art.6
- We keep data handling simple and minimal by design; we are not a certified
  auditor or financial advisor.
- We support data deletion on request (right to erasure). ref: GDPR Art.17

> **Honesty note:** SaaSpend is a decision-support tool that helps you spot likely
> duplicate categories and forgotten tools. It does **not** guarantee compliance,
> 100% coverage, that you will never miss a subscription, or that listed savings are
> realized. Treat its output as decision-support, not financial or legal advice.

## Subprocessors
We rely on our hosting provider (Vercel) and payment processor (Waffo). No data is
sold to third parties. ref: OWASP Top 10 (secure defaults)
