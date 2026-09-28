# Pilot remediation release — 28 September 2026

Release this frontend with the API release `pilot-remediation-20260928`. The new API provides the knowledge library, academic previews, checked exports and confirmed feedback persistence.

## Validation

Use Node 22 and run `npm ci`, `npm run build` and `npm audit --omit=dev --audit-level=high`. Configure `NEXT_PUBLIC_API_URL` for the target API and explicitly allow the frontend origin in the API's `FRONTEND_ORIGIN` configuration. Never expose provider keys in frontend variables.

## Pilot behavior

The workspace supports structured CV input, CV review and revision, career guidance, discovery, academic drafting and text conversation with an illustrated adviser and editable notebook. The adviser is not a live video or voice avatar.

Academic drafting includes an editable preview, character and word counts, factual confirmation and checked export. The UCAS 2026 format and Cambridge Public Health and Primary Care PhD statement have scoped, dated presets; other programmes require the applicant's official instructions. These are drafts for applicant review, not an admissions guarantee.

Evidence panels identify reviewed short reference notes and their limitations. They do not imply a complete publication corpus or verified support for every generated claim. No uncalibrated confidence percentage is displayed.

Feedback shows success only after the backend confirms storage. A retained request ID makes retries idempotent. Synthetic acceptance feedback must be excluded from real pilot analysis.

The global response language selector applies to guidance, assistant answers and résumé analysis; documents and discovery remain English. Public launch still requires a durable invitation/session and quota design, privacy and retention decisions, broader catalogue coverage and human pilot acceptance. Do not enable payments or migrate infrastructure until acceptance gaps are resolved.
