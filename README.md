# ReceptAI

A polished white-label SaaS demo for selling AI voice receptionists to local service businesses. It combines a conversion-focused marketing site with a realistic client command center for calls, appointments, leads, automations, and agent settings.

## What’s included

- Responsive SaaS landing page with pricing and lead capture
- Interactive dashboard with eight product views
- Searchable call log, transcripts, summaries, and CSV export
- Appointment calendar and lead pipeline
- AI receptionist voice, greeting, and availability controls
- Follow-up automation and performance analytics demos
- Signup details persisted into the dashboard with local storage
- Accessible keyboard states and reduced-motion support

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite. Use **View Live Demo Dashboard** on the landing page to enter the product.

## Production build

```bash
npm run build
npm run preview
```

The deployable output is generated in `dist/` with both `index.html` and `dashboard.html` entry points.

## Production architecture

The current application is intentionally a frontend demo. The production design and integration plan are documented separately:

- [Architecture](docs/ARCHITECTURE.md) — system boundaries, tenancy, security, data model, event flows, and delivery phases
- [API and integration guide](docs/API_INTEGRATIONS.md) — required APIs, Synthflow enablement, webhooks, application endpoints, LLM strategy, and MCP usage

## Productization notes

This repository is a frontend sales demo. To take payments and handle real calls, connect the signup form to your CRM/payment stack and replace the seeded dashboard data with your voice platform’s API and webhooks. Keep credentials in server-side environment variables—never in the browser bundle.
