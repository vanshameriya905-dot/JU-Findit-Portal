# Project memory

## Product intent & audience

- **JU FindIt Portal**: digital lost & found platform for JECRC University.
- Primary users: students and faculty (reporting, browsing, claiming); administrators (review, approve, manage).
- Goal: professional, presentation-ready prototype demonstrating full lost & found workflow with demo data.

## Brand personality & voice

- Professional, university-grade, trustworthy, campus-oriented.
- Clear, helpful, safety-conscious tone (privacy around sensitive claim data).
- JECRC University branding assets referenced; no extra generated photography.

## Visual design & UX direction

- Stack: Vite + React + TypeScript + Tailwind CSS; icons from `lucide-react`; imports via `@/` alias.
- Responsive layouts across all pages; production-quality, non-cookie-cutter UI.
- Floating chatbot ("JU Assist") bottom-right on every page with welcome message, suggested questions, chat input/send.
- Professional data tables, filters, status indicators, action buttons in admin.
- Image preview on upload forms; large photo on item details; card-based marketplace listings.
- Status badges with distinct visual states for report lifecycle.

## Decisions, constraints & rationale

- Exactly 9 main pages; no extra routes or duplicated components.
- 10 fixed college locations: NYB, VIB, KIB, KAB, Cafeteria, Mess, Sports Complex, Cricket Ground, Football Ground, Other/Specific Location (Other reveals custom input). All options also accept exact-location description.
- Report statuses: Submitted, Under Review, Potential Match, Claim Pending, Verified, Resolved, Rejected.
- Rule-based smart matching engine kept in a separate service module so a real AI matching API can be integrated later; matching factors: item name, category, description keywords, location, exact location, date/time; includes confidence score.
- Claim verification is admin-only flow: submit → admin queue → review private info → approve/reject → user notified → mark Returned/Resolved. AI never approves ownership claims.
- Centralised data models for Users, Reports, Lost Items, Found Items, Claims, Notifications, Categories, College Locations.
- Separate service modules: auth, reports, matching, chatbot, mock data.
- Shared simulated data with local persistence so demo actions survive refresh.
- JU Assist uses simulated contextual responses and local sample data; not advertised as live AI.
- 12–15 sample listings across all 10 locations, including intentional lost/found pairs for matching demos.
- No real database, paid AI API, API keys, or secrets in frontend at this stage.
- Every visible button has a meaningful action; no decorative non-functional buttons.
- No campus image assets available in project; hero uses a temporary photo fallback (noted as cleanup item).

## Open questions & assumptions

- Real admin permissions must eventually be enforced server-side (prototype simulates admin only).
- AI matching API and live chatbot API integration deferred; current modules structured to allow future swap-in.
- Real backend/database connection deferred; persistence is local-only for the demo.
- Permanent campus imagery/branding assets still need to be added to project to replace temporary photo fallback.
- Auth is demo-only (login/registration flow simulated); real auth not implemented.