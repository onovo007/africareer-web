# AfriCareer AI - Web (Next.js)

Polished front end for AfriCareer AI. Calls the FastAPI backend
(`africareer-api` on Render) for AI Assistant, Job Search, Learning, and CV builder.
Deploy on Vercel.

## Run locally
```bash
npm install
cp .env.local.example .env.local     # set NEXT_PUBLIC_API_URL to your Render URL
npm run dev                          # http://localhost:3000
```

## Deploy on Vercel
1. Push this folder to a GitHub repo (e.g. `africareer-web`).
2. Vercel -> New Project -> import the repo (Next.js is auto-detected).
3. Add an Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://africareer-api.onrender.com`
4. Deploy. You get a URL like `https://africareer-web.vercel.app`.
5. Back in Render, set the API's `FRONTEND_ORIGIN` to that Vercel URL (and your custom
   domain) so only your site can call the API.

## Structure
- `app/page.js` - marketing landing page
- `app/app/page.js` - the tool (AI Assistant, Job Search, Learning, CV Builder)
- `lib/api.js` - typed calls to the backend (JSON + DOCX download)

More features (motivation letters, resume analysis, opportunities, auth, payments)
are ready in the backend and can be added to the UI incrementally.
