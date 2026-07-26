# ReceptAI Operational MVP Checklist

Status: implementation backlog

Priority: launch-blocking work first

Last updated: 2026-07-26

Related documents: [Architecture](./ARCHITECTURE.md) and [API integrations](./API_INTEGRATIONS.md)

## MVP outcome

ReceptAI is ready to sell as an operational MVP when one real customer can complete this entire path without a developer manually editing data:

1. Sign up, verify their identity, select a plan, and create a business workspace.
2. Configure an AI receptionist, connect or receive a phone number, and run a test call.
3. Receive a real inbound call that is answered by the configured agent.
4. See the call, outcome, transcript, recording, lead, and usage in the correct tenant dashboard.
5. Book a conflict-safe calendar appointment and send the customer a confirmation.
6. Update agent and business settings, manage billing, and receive support.
7. Recover safely from provider retries, duplicate webhooks, failed jobs, and failed payments.

No dashboard control may report success unless a real backend operation succeeded. Features outside launch scope must be hidden, disabled with an honest explanation, or clearly marked as preview.

## Current baseline

- [x] The marketing site and dashboard build successfully with `npm run build`.
- [x] Static hosting packages `index.html`, `dashboard.html`, and their assets.
- [x] Production architecture and API contracts are documented.
- [ ] There is no backend, database, authentication, queue, private storage, or secrets service.
- [ ] Signup currently writes a profile to browser `localStorage`.
- [ ] Calls, leads, appointments, analytics, integrations, billing, and agent state are seeded or simulated in `dashboard.js`.
- [ ] There are no live Synthflow, calendar, billing, CRM, SMS, email, or support integrations.
- [ ] There is no automated test suite, CI workflow, dependency lockfile, staging environment, monitoring, or recovery runbook.

### Static hosting blocker at `scripts/prepare-sites.mjs:65`

`scripts/prepare-sites.mjs` generates an asset-only worker. Its `fetch()` handler rejects every method except `GET` and `HEAD`, so a signup, settings update, OAuth callback, or webhook sent to this worker returns `405 Method not allowed`.

- [ ] Keep this worker responsible for public static assets only.
- [ ] Deploy the application API, webhook receiver, workers, database, and private storage as server-side services.
- [ ] Route `/api/*` to the API service through the production edge, or use a dedicated API origin with an exact CORS allowlist.
- [ ] Verify that browser API requests use secure sessions and that provider webhooks bypass the static worker.
- [ ] Add a deployment smoke test proving `GET /dashboard` serves the app and `POST /api/auth/sign-up` reaches the API rather than returning the static worker's `405`.

## Launch scope

### Must work at launch

- Customer signup, sign-in, sign-out, email verification, password recovery, and secure sessions
- Organization creation, owner membership, tenant isolation, and basic role enforcement
- Plan selection, checkout or trial activation, subscription state, entitlements, and usage
- Synthflow workspace/subaccount mapping, agent provisioning, configuration, activation, and pause
- One production phone-number path: provision, port/import, or SIP connection
- Signed Synthflow webhook ingestion and real call history
- Authorized transcript and recording access
- One calendar provider with availability, booking, rescheduling, cancellation, and reconciliation
- Basic business profile, greeting, voice, hours, escalation number, and knowledge configuration
- Booking confirmation plus essential operational notifications
- Operator visibility into failed provisioning, webhook, sync, and billing work
- Monitoring, alerts, backups, restore testing, support, privacy controls, and incident procedures

### Hide or defer until after launch

- Multiple calendar, CRM, telephony, or voice providers
- Custom workflow builder and broad automation marketplace
- Advanced analytics, revenue attribution, and AI-generated ROI claims
- Multi-location administration
- Full team invitation and custom-role management beyond the launch roles
- Direct LLM processing outside the selected voice platform
- Customer-facing MCP tools or an autonomous operations agent
- Advanced white-label customization

## P0 decisions and external prerequisites

These decisions block implementation. Record each answer in a short architecture decision record.

- [ ] Confirm the Synthflow Agency/Partner plan, API access, regional base URL, white-label/subaccount rights, concurrency, trial, telephony, webhook, browser-test, and billing entitlements.
- [ ] Choose the launch geography and customer-data region.
- [ ] Choose who owns phone numbers: Synthflow, Twilio, or customer SIP.
- [ ] Choose exactly one launch calendar provider.
- [ ] Choose the billing authority: Synthflow rebilling or ReceptAI-managed Stripe.
- [ ] Choose the provider for transactional email and, if required, consented SMS.
- [ ] Decide whether CRM synchronization is excluded from launch or choose exactly one CRM.
- [ ] Define launch plans, prices, included minutes, overages, grace periods, and feature entitlements.
- [ ] Define supported business type, time zone, language, and single-location limitation.
- [ ] Approve recording disclosure, messaging consent, retention, deletion, and privacy policies for the launch region.
- [ ] Define support hours, escalation owner, incident owner, and customer-facing status channel.
- [ ] Create separate development, staging, and production provider accounts and credentials.

Exit evidence:

- [ ] Decision records are approved.
- [ ] Required provider features work in staging accounts.
- [ ] Credential owners and rotation contacts are documented.
- [ ] No launch-critical dependency is still described as “TBD.”

## P0 implementation backlog

### P0-01 — Make the repository reproducible

- [ ] Pin the supported Node.js version.
- [ ] Commit a dependency lockfile and use deterministic installs in CI.
- [ ] Add formatting, linting, type checking, unit testing, integration testing, and production-build scripts.
- [ ] Add a validated `.env.example` containing names only, never credentials.
- [ ] Add dependency and secret scanning.
- [ ] Add GitHub Actions for install, lint, type check, test, build, and security checks.
- [ ] Protect the production branch and require passing checks before merge.

Acceptance:

- [ ] A clean clone can install and build with documented commands.
- [ ] CI fails on a test, type, lint, build, leaked-secret, or vulnerable-dependency regression.
- [ ] The browser bundle contains no server credentials.

### P0-02 — Stand up the server-side platform

- [ ] Create a TypeScript API service with versioned routes under `/api`.
- [ ] Add PostgreSQL with versioned, repeatable migrations.
- [ ] Add a durable job queue with retry scheduling and a dead-letter queue.
- [ ] Add private object storage for recordings and knowledge documents.
- [ ] Add a managed secret store or encrypted credential vault.
- [ ] Add `/health/live` and dependency-aware `/health/ready` endpoints.
- [ ] Add environment validation that fails startup when required configuration is missing.
- [ ] Configure development, staging, and production as isolated environments.
- [ ] Configure same-origin API routing where possible; otherwise restrict CORS to exact approved origins and allow credentials safely.

Acceptance:

- [ ] A migration can create a fresh staging database and roll forward safely.
- [ ] The API, worker, database, queue, and storage pass readiness checks.
- [ ] A failed background job retries with bounded exponential backoff and can be replayed from the dead-letter queue.
- [ ] Static hosting and API deployments can roll back independently.

### P0-03 — Implement authentication, organizations, and tenant isolation

- [ ] Implement signup, verification, sign-in, sign-out, recovery, and session revocation.
- [ ] Use secure, HTTP-only, same-site cookies; do not store bearer tokens in `localStorage`.
- [ ] Create `users`, `organizations`, `memberships`, and roles.
- [ ] Derive the active organization from the verified session, not a trusted client-supplied ID.
- [ ] Enforce tenant authorization in both API queries and database policy/queries.
- [ ] Support at least owner, administrator, manager, and read-only permissions internally.
- [ ] Require recent authentication for billing, credential, and destructive changes.
- [ ] Add rate limits and abuse controls to authentication and recovery endpoints.
- [ ] Record security-sensitive actions in an append-only audit log.

Acceptance:

- [ ] Automated tests prove users cannot read, infer, export, or mutate another organization's data.
- [ ] Revoked sessions stop working immediately or within the documented maximum.
- [ ] Login, verification, recovery, logout, expiration, and locked-account states have working UI.

### P0-04 — Create the core data model

- [ ] Add organizations, locations, memberships, voice agents, and phone-number tables.
- [ ] Add calls, call events, transcripts, recording references, contacts, leads, and appointments.
- [ ] Add integration connections, provider mappings, operations, and provisioning state.
- [ ] Add subscriptions, entitlements, immutable usage ledger entries, and plan versions.
- [ ] Add webhook receipts, outbox events, job records, and audit logs.
- [ ] Put immutable `organization_id` ownership on every tenant record.
- [ ] Add uniqueness constraints for provider IDs and idempotency keys.
- [ ] Add created, updated, deleted/retained, and source timestamps where required.
- [ ] Define cascade, retention, anonymization, and deletion behavior explicitly.
- [ ] Seed only isolated development and staging accounts; never seed production customer records.

Acceptance:

- [ ] Migrations and constraints reject cross-tenant or duplicate provider mappings.
- [ ] Replaying the same event cannot duplicate calls, appointments, messages, or usage.
- [ ] A documented deletion job removes or anonymizes customer data according to policy.

### P0-05 — Provision a real voice receptionist

- [ ] Implement a typed Synthflow adapter; keep provider payloads out of domain and UI contracts.
- [ ] Create or associate the customer's provider workspace/subaccount.
- [ ] Provision an agent from an approved, versioned template.
- [ ] Store desired configuration separately from last-confirmed provider configuration.
- [ ] Implement greeting, voice, hours, escalation, activation, pause, and knowledge updates.
- [ ] Implement the selected phone-number assignment/import path.
- [ ] Model provisioning as resumable states: `pending`, `provisioning`, `action_required`, `ready`, and `failed`.
- [ ] Add idempotency to every provisioning step.
- [ ] Add a supported test-call flow and show its real state and cost implications.
- [ ] Reconcile agent and number state on a schedule.

Acceptance:

- [ ] A new staging customer can reach `ready` without database edits.
- [ ] Retrying any provisioning step does not create duplicate agents or numbers.
- [ ] Provider failure produces an actionable customer state and an operator alert.
- [ ] A real test call uses the saved customer configuration.

### P0-06 — Ingest calls and secure recordings

- [ ] Implement `POST /api/webhooks/synthflow` with the provider's current signature-verification rules.
- [ ] Apply request-size limits, constant-time signature comparison, replay protection, and event deduplication.
- [ ] Persist the authenticated webhook receipt before acknowledging it.
- [ ] Acknowledge quickly and process normalization asynchronously.
- [ ] Map the provider call to the organization from trusted provider mappings.
- [ ] Upsert the call, participants, transcript, outcome, extracted fields, lead, appointment reference, and usage.
- [ ] Store recordings privately or retain a protected provider reference.
- [ ] Return only short-lived recording access after authorization.
- [ ] Escape transcripts and provider text as untrusted content.
- [ ] Add a reconciliation job for missing, delayed, duplicated, or out-of-order call events.

Acceptance:

- [ ] Valid webhook-to-dashboard latency meets the agreed target; initial target: 95% within 60 seconds.
- [ ] Invalid signatures receive no processing and create a security metric without leaking verification details.
- [ ] Duplicate and out-of-order webhook tests produce one correct call and one set of downstream effects.
- [ ] Cross-tenant transcript and recording access tests fail closed.
- [ ] Full transcripts, recordings, phone numbers, and secrets do not appear in application logs.

### P0-07 — Implement one calendar integration

- [ ] Implement OAuth with signed, short-lived, single-use state bound to user and organization.
- [ ] Store tokens encrypted and retain granted scopes, expiry, health, and provider account/calendar IDs.
- [ ] Implement availability using working hours, time zones, daylight-saving changes, service duration, buffers, service area, and existing events.
- [ ] Implement idempotent create, reschedule, and cancel operations.
- [ ] Prevent double booking under concurrent browser, caller, webhook, and worker retries.
- [ ] Store provider event IDs and reconcile provider-side changes.
- [ ] Refresh expiring tokens and surface reconnect-required states.
- [ ] Send a consented booking confirmation and record delivery state.

Acceptance:

- [ ] Two simultaneous attempts for the same slot result in at most one confirmed appointment.
- [ ] Booking, rescheduling, cancellation, token expiry, revoked access, and provider outage scenarios pass in staging.
- [ ] Calendar changes appear in ReceptAI within the documented sync window.

### P0-08 — Implement billing, plans, entitlements, and usage

- [ ] Implement the selected billing authority only.
- [ ] Create checkout/trial activation and an authenticated billing-portal flow.
- [ ] Treat signed subscription webhooks—not redirects—as authoritative.
- [ ] Version plans and derive entitlements from subscription state and plan version.
- [ ] Write immutable call usage entries with stable source IDs.
- [ ] Enforce agent, number, location, concurrency, minute, and feature limits server-side.
- [ ] Implement trial end, payment failure, grace period, cancellation, and reactivation states.
- [ ] Reconcile subscriptions and usage on a schedule.
- [ ] Define an operator correction process that preserves audit history.

Acceptance:

- [ ] Duplicate billing events cannot duplicate charges, subscriptions, or usage.
- [ ] A failed payment follows the approved grace-period policy.
- [ ] The dashboard amount, plan, renewal date, usage, and entitlements come from the backend.
- [ ] Test-mode checkout, upgrade, downgrade, cancellation, failed payment, and portal access pass end to end.

### P0-09 — Replace every simulated customer workflow

- [ ] Replace `localStorage` signup with real auth, organization creation, and onboarding state.
- [ ] Add an authenticated app shell and protect `/dashboard`.
- [ ] Replace seeded calls, transcripts, recordings, leads, appointments, usage, and analytics with API data.
- [ ] Wire agent activate/pause, greeting, voice, hours, escalation, and knowledge controls to real operations.
- [ ] Wire appointment creation and calendar views to persisted data.
- [ ] Wire billing, integration health, business profile, and subscription management to the backend.
- [ ] Replace fake timers and success toasts with pending, success, validation, provider-error, and retry states.
- [ ] Add loading, empty, partial, stale, offline, unauthorized, forbidden, and reconnect states.
- [ ] Use server-side pagination/filtering for calls and server-generated exports for large or sensitive datasets.
- [ ] Remove hard-coded July 2026 dates, customer names, phone numbers, revenue, connected tools, and plan usage from production.
- [ ] Hide deferred CRM, custom automation, advanced analytics, team, and integration controls until they are real.
- [ ] Add error boundaries and preserve unsaved form changes when a retry is safe.

Acceptance:

- [ ] Browser network inspection shows every customer-visible mutation reaches an authenticated API.
- [ ] Refreshing or using a second device preserves backend state.
- [ ] A provider/API failure never produces a success message.
- [ ] A brand-new organization sees a truthful empty/onboarding state, not Northstar demo data.

### P0-10 — Add security, privacy, and compliance controls

- [ ] Complete a threat model for authentication, tenant isolation, provider credentials, webhooks, recordings, transcripts, exports, and billing.
- [ ] Encrypt data in transit and sensitive data at rest.
- [ ] Keep provider keys and OAuth refresh tokens server-side with least-privilege scopes.
- [ ] Add CSP, HSTS at the production edge, frame restrictions, `Permissions-Policy`, `nosniff`, and a strict referrer policy.
- [ ] Add CSRF protection to cookie-authenticated mutations.
- [ ] Add input schemas, upload validation, malware scanning, size limits, and safe file-name/content handling.
- [ ] Add application and organization quotas to costly operations.
- [ ] Add recording disclosure, SMS consent, opt-out, retention, export, and deletion controls required by the launch region.
- [ ] Redact secrets and unnecessary PII from logs, errors, analytics, and support tools.
- [ ] Run dependency, SAST, DAST, and authorization testing.
- [ ] Document vulnerability reporting and credential rotation.

Acceptance:

- [ ] No critical/high unresolved launch vulnerability remains without written risk acceptance.
- [ ] Tenant-isolation and authorization tests cover every tenant-owned route.
- [ ] A customer data export and deletion request can be completed and audited.
- [ ] Secret rotation is tested in staging without an outage.

### P0-11 — Build operator and support workflows

- [ ] Add an operator view for organization, provisioning, provider mapping, integration, subscription, usage, and job health.
- [ ] Add safe replay actions for failed idempotent jobs and quarantined events.
- [ ] Add impersonation only if essential; require approval, visible indication, time limits, and an audit trail.
- [ ] Integrate a real support channel and include authenticated tenant context.
- [ ] Add customer-visible integration and provisioning status with remediation steps.
- [ ] Create procedures for failed provisioning, number issues, webhook backlog, calendar disconnect, failed payment, data request, and customer cancellation.
- [ ] Define manual fallbacks for a voice-provider outage and urgent call-routing incident.

Acceptance:

- [ ] Support can diagnose the first customer's common failures without database shell access.
- [ ] Every privileged operator action records actor, reason, target organization, and result.
- [ ] Runbooks have been exercised in staging.

### P0-12 — Add observability, backups, and reliability

- [ ] Add structured logs with request, organization, provider-resource, webhook-event, and job correlation IDs.
- [ ] Add error tracking, API metrics, distributed traces where useful, queue metrics, and provider health.
- [ ] Alert on authentication anomalies, signature failures, webhook lag, dead letters, provisioning failures, booking conflicts, token expiry, payment failures, and usage variance.
- [ ] Define initial service-level indicators and objectives.
- [ ] Add database backups with point-in-time recovery where available.
- [ ] Add object-storage retention/versioning appropriate to the data policy.
- [ ] Test restore into an isolated environment and record recovery time and recovery point.
- [ ] Add timeouts, bounded retries, jitter, concurrency limits, and circuit breakers around providers.
- [ ] Add scheduled reconciliation for agents, phone numbers, calls, calendar events, subscriptions, and usage.
- [ ] Publish an incident severity model, escalation tree, and communication templates.

Acceptance:

- [ ] A synthetic signup/readiness check runs continuously against production.
- [ ] On-call receives a useful alert when a staged failure is injected.
- [ ] Backup restore and dead-letter replay drills succeed.
- [ ] Dashboards show webhook-to-dashboard latency, provisioning success, booking success, queue age, and billing/usage reconciliation.

### P0-13 — Test the full revenue path

- [ ] Add unit tests for domain rules, entitlement checks, signatures, state machines, and provider error mapping.
- [ ] Add integration tests against PostgreSQL, queue, storage, and provider adapters.
- [ ] Add contract fixtures for current provider webhook and API payloads.
- [ ] Add end-to-end tests for signup, onboarding, checkout, agent provisioning, test call, inbound call, call review, booking, settings, billing, and logout.
- [ ] Add negative tests for invalid sessions, wrong roles, cross-tenant IDs, duplicate events, expired OAuth state, CSRF, and malicious transcript/upload content.
- [ ] Add accessibility testing for keyboard, focus, labels, errors, contrast, reduced motion, and screen readers.
- [ ] Test supported mobile and desktop browsers.
- [ ] Load-test webhook bursts, call-list pagination, exports, and background jobs at the expected launch volume plus safety margin.
- [ ] Run a staging pilot using real provider test resources and synthetic customer data.

Acceptance:

- [ ] The critical-path end-to-end suite is green on the release commit.
- [ ] Zero cross-tenant access is observed in automated security tests.
- [ ] Known limitations and accepted risks are documented with owners and review dates.

### P0-14 — Create safe deployment and release workflows

- [ ] Build immutable, traceable artifacts from reviewed commits.
- [ ] Run migrations as an explicit release step with forward-compatible changes.
- [ ] Deploy to staging automatically and production through an approved promotion.
- [ ] Keep webhook handling compatible with the previous release during rollout.
- [ ] Add post-deployment smoke tests for static pages, sessions, API mutations, webhook ingress, queue processing, and database reads.
- [ ] Define rollback for frontend, API, worker, and configuration changes.
- [ ] Use feature flags or organization allowlists for risky capabilities.
- [ ] Record the deployed commit, migration version, configuration version, and provider template version.

Acceptance:

- [ ] A staging release and rollback are demonstrated.
- [ ] Production promotion stops automatically when smoke tests fail.
- [ ] Rollback does not lose accepted webhooks or corrupt provisioning/billing state.

## P1 follow-up backlog

Start these only after the P0 revenue path is stable, unless a signed launch customer contract requires one.

- [ ] Add one CRM adapter with OAuth, field mapping, incremental sync, webhooks, conflict policy, retries, and reconnect states.
- [ ] Add team invitations and complete role-management UI.
- [ ] Add configurable SMS/email automations with consent, templates, quiet hours, opt-out, delivery receipts, and per-tenant limits.
- [ ] Add a knowledge-document manager with upload progress, parsing status, source/version display, deletion, and provider reconciliation.
- [ ] Add real analytics aggregation and clearly defined metric formulas.
- [ ] Add notification preferences and real in-app/email operational notifications.
- [ ] Add multi-location support only after every tenant-owned query is location-aware where required.
- [ ] Add a second provider only behind the existing adapter contract.
- [ ] Evaluate direct LLM processing only for a measured product gap with schema validation, PII controls, evaluation data, cost budgets, and prompt/model versioning.

## Customer-facing feature acceptance matrix

| Surface | Launch behavior | Evidence required |
|---|---|---|
| Marketing signup | Creates a verified user and resumable organization onboarding flow | End-to-end signup and recovery tests |
| Dashboard access | Requires a valid session and tenant membership | Unauthorized and cross-tenant tests |
| Overview | Shows real, defined metrics or a truthful empty state | API/DB reconciliation test |
| Calls | Lists real paginated calls with secure detail access | Webhook fixture and recording authorization tests |
| Appointments | Reads and writes the connected calendar safely | Concurrency and reconciliation tests |
| Leads | Shows persisted voice-derived leads; CRM status is honest | Call-to-lead idempotency test |
| AI receptionist | Saves and confirms real provider configuration | Desired-versus-confirmed state test |
| Test call | Starts a supported real test flow and reports failures/cost | Staging provider test |
| Automations | Only enabled actions execute and record delivery state | Duplicate/retry and consent tests |
| Analytics | Uses documented formulas over persisted data | Query fixture and boundary tests |
| Integrations | Shows actual connection health and reconnect actions | OAuth expiry/revocation tests |
| Team | Enforces roles server-side or is hidden for launch | Role matrix tests |
| Billing | Uses authoritative subscription and usage data | Billing webhook and entitlement tests |
| Support | Opens a real support path with safe tenant context | Support handoff test |

## Recommended critical path

1. Approve P0 decisions and secure staging provider access.
2. Make the repository reproducible and stand up API, database, queue, storage, and secrets.
3. Implement authentication, organizations, tenant isolation, and the core schema.
4. Provision one real agent and phone-number path.
5. Ingest a signed real call and render it securely in the dashboard.
6. Book and reconcile one real calendar appointment.
7. Activate billing, entitlements, and usage.
8. Replace or hide every simulated UI action.
9. Complete security, operations, observability, recovery, and end-to-end validation.
10. Pilot with internal/staging tenants, then a small allowlisted production cohort.

## Production launch gate

Do not launch paid self-service access until every item below is checked:

- [ ] A new customer completes signup through first real answered call without developer intervention.
- [ ] A booked appointment survives duplicate and concurrent requests without double booking.
- [ ] Tenant-isolation tests cover every API route and export.
- [ ] Billing, entitlements, usage, cancellation, and failed-payment behavior are verified.
- [ ] Provider credentials, OAuth tokens, recordings, and transcripts are protected and auditable.
- [ ] Fake data and simulated success behavior are absent from production.
- [ ] Monitoring, alerts, support ownership, incident response, backups, and restore are operational.
- [ ] Staging load, security, accessibility, and browser test gates pass.
- [ ] Privacy policy, terms, recording disclosure, retention, deletion, and consent flows are approved.
- [ ] Release, smoke-test, rollback, webhook compatibility, and reconciliation procedures are proven.
- [ ] Known risks have named owners, mitigation dates, and explicit launch approval.

## Definition of done for each checked item

A checkbox is complete only when:

- The implementation is merged and deployed to staging.
- Automated tests cover success, failure, authorization, retry, and idempotency where applicable.
- Customer loading, empty, error, and recovery states are usable.
- Metrics, alerts, audit events, and support diagnostics exist where applicable.
- Security and privacy requirements are met.
- Documentation and runbooks are updated.
- The named acceptance evidence is linked from the pull request or issue.
