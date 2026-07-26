# ReceptAI API and Integration Guide

Status: proposed production contract
Last updated: 2026-07-23

## Scope

This document identifies the external capabilities ReceptAI must enable, the application APIs required to connect the existing UI, and the correct roles of direct APIs, webhooks, LLMs, and MCP.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for component boundaries, data ownership, security, and deployment design.

## Integration strategy

Production customer workflows use:

- Server-to-server REST APIs or official SDKs
- OAuth 2.0 for tenant-authorized calendar and CRM connections
- Signed webhooks for provider events
- Background jobs for retries and fan-out
- A normalized ReceptAI database as the dashboard read model

MCP is not the browser integration layer. It is optional tooling for development, internal operations, or a future server-side AI operator.

## Current connectivity

No external service is connected in the current repository:

| Capability | Current state |
|---|---|
| Application API | None |
| Authentication | None |
| Database | None |
| Synthflow | Not connected |
| Conversational LLM | Not connected |
| Direct LLM API | Not connected |
| Calendar | Not connected |
| CRM | Not connected |
| Billing | Not connected |
| SMS or email | Not connected |
| Runtime MCP | None |

The dashboard's calls, transcripts, summaries, sentiment, appointments, leads, and analytics are seeded browser data. The existing test-call, agent-save, CRM-sync, and automation controls are UI simulations.

## Capability matrix

| Product capability | Primary runtime integration | Required backend capability | MCP role |
|---|---|---|---|
| Organization signup | Auth and application database | Organization provisioning and onboarding state | Development/admin only |
| Team invitations and roles | Auth provider | Membership API and RBAC | Development/admin only |
| White-label customer workspace | Synthflow subaccounts | Provider mapping and provisioning jobs | Optional operator tooling |
| Agent creation and settings | Synthflow Agents API | Agent adapter, version state, audit log | Optional operator tooling |
| Voice and knowledge base | Synthflow voice and knowledge APIs | Secure document ingestion and provider sync | None at runtime |
| Phone number and deployment | Synthflow telephony, Twilio, or SIP | Number assignment and status reconciliation | None |
| Inbound and outbound calls | Synthflow Calls API | Call authorization, initiation, and status tracking | None |
| Call history and transcripts | Synthflow post-call webhooks and Calls API | Signed ingestion and normalized call records | None |
| Recording playback | Synthflow recording reference or private object storage | Authorized media endpoint and short-lived URL | None |
| Appointment booking | Google Calendar, Microsoft Graph, Cal.com, or GHL | OAuth vault, availability, booking, reconciliation | Test/admin only |
| Lead pipeline and CRM sync | HubSpot or GoHighLevel | OAuth, field mapping, cursors, conflict handling | Test/admin only |
| SMS follow-up | Synthflow action or messaging provider | Consent, templates, opt-out, delivery receipts | None |
| Subscription and usage | Synthflow Stripe rebilling or Stripe Billing | Webhooks, entitlements, usage ledger, portal | None |
| Analytics | ReceptAI database and Synthflow analytics | Aggregation jobs and query API | None |
| Support | Support provider or internal ticket API | Identity handoff and tenant context | Optional internal tooling |

## Synthflow enablement

Confirm the following in the Synthflow Agency/Partner workspace before implementation:

### Account and tenancy

- Agency/white-label entitlement
- Selected Global, US, or EU data region and its matching API base URL
- Custom domain and brand settings when required
- Server-side Platform API access
- One subaccount per ReceptAI customer organization
- Subaccount permissions, product access, usage limits, and concurrency
- Secure handling for any returned subaccount API key or sign-in link

### Voice agent template

- Inbound voice product enabled
- Approved model and language
- Voice, greeting, prompt, and fallback behavior
- Business-hours and escalation rules
- Call transfer action
- Structured post-call extraction
- Knowledge base where required
- Recording policy
- Inbound and post-call webhook URLs

Synthflow's current Platform API uses regional `/v2` endpoints. Agent resources are named assistants in the API, for example `POST /v2/assistants`, and returned agent identifiers may be named `model_id`. Keep those provider names inside the Synthflow adapter instead of exposing them as ReceptAI domain terminology.

### Telephony

- Phone-number provisioning or import path
- Twilio or SIP configuration if numbers are not Synthflow-managed
- Outbound calling permission if test or follow-up calls require it
- Concurrency and geographic restrictions

Custom telephony applications require Enterprise according to the current Synthflow documentation. Agency parent and subaccounts also share a concurrency pool, so ReceptAI must enforce capacity before promising isolated per-customer concurrency.

### Actions and integrations

- API request actions
- Appointment booking action
- SMS or message action
- CRM/calendar native integration, if selected
- Workflow entitlement if advanced provider-side workflows are used

Synthflow Workflows are currently Enterprise-only and are not an add-on for lower plans. Treat them as an optimization, not a prerequisite for the MVP; Actions, native integrations, webhooks, and ReceptAI workers can implement the revenue path without them.

Synthflow Actions can currently perform transfers, HTTP requests, MCP actions, in-call SMS or WhatsApp, booking, post-call SMS, extraction, evaluation, and IVR behavior. An MCP action is optional and becomes useful only when ReceptAI deliberately exposes multiple governed backend tools through an MCP server.

### Billing and operations

- Stripe connection and pricing plans if using Synthflow rebilling
- Included minutes and overage rates
- Simulations or supported test-call method
- Webhook delivery logs
- Usage and analytics access

Treat test experiences separately:

- Simulation suites run automated agent-versus-persona tests and may be billable.
- `POST /v2/calls` places a real phone call.
- Browser voice should use Synthflow's current widget or WebSocket Media flow.

Do not use the legacy `GET /websocket/token/{assistant_id}` integration, which was deprecated on 2026-06-15. For a custom browser client, ReceptAI should authorize the session server-side and return only the current short-lived, region-scoped media URL required by Synthflow's supported flow.

If Synthflow manages Stripe rebilling, confirm owner/admin access, connected Stripe account, plan currency, trials, included minutes, concurrency, overages, and enabled products. Current constraints include a 200-minute trial cap, same-currency plan restrictions, and subaccount allocations drawing from the parent account's balance.

Do not design authoritative customer metering around polling subaccount `minutes_used`. Current official documentation says subaccount minute usage is not exposed through the API, despite a contradictory example field. Use call events and a ReceptAI usage ledger, then confirm any provider reconciliation capability contractually.

Official references:

- [Platform API overview](https://docs.synthflow.ai/getting-started-with-your-api)
- [API authentication](https://docs.synthflow.ai/authentication)
- [Create an agent](https://docs.synthflow.ai/api-reference/platform-api/agents/create-assistant)
- [Make a call](https://docs.synthflow.ai/api-reference/platform-api/calls/voice-call)
- [Webhooks](https://docs.synthflow.ai/webhooks)
- [Actions](https://docs.synthflow.ai/actions-overview)
- [Workflows](https://docs.synthflow.ai/workflows)
- [Simulations](https://docs.synthflow.ai/simulations)
- [Browser WebSocket Media integration](https://docs.synthflow.ai/ws-media-integration)
- [Create a subaccount](https://docs.synthflow.ai/create-a-subaccount)
- [Subaccount permissions](https://docs.synthflow.ai/manage-subaccount-permissions)
- [White-label administration](https://docs.synthflow.ai/agency-whitelabel-dashboard)
- [Stripe overview](https://docs.synthflow.ai/stripe-overview)
- [Pricing and rebilling](https://docs.synthflow.ai/set-up-pricing-and-rebilling)
- [Deployment options](https://docs.synthflow.ai/deploy-your-agent)

Provider endpoints, payload fields, rate limits, plan availability, and browser voice guidance can change. Verify the linked documentation during implementation instead of copying provider schemas into the browser.

## ReceptAI application API

All `/api` endpoints require an authenticated session unless explicitly marked as a provider webhook or OAuth callback. Tenant scope comes from the verified session, not from a trusted client-supplied organization ID.

### Authentication and organizations

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/api/auth/sign-up` | Create a pending account and verification flow |
| `POST` | `/api/auth/sign-in` | Establish a secure session |
| `POST` | `/api/auth/sign-out` | Revoke the current session |
| `GET` | `/api/session` | Return user, organization, role, and entitlements |
| `POST` | `/api/organizations` | Create an organization and provisioning workflow |
| `GET` | `/api/organization` | Read the active organization profile |
| `PATCH` | `/api/organization` | Update permitted business settings |
| `GET` | `/api/members` | List organization memberships |
| `POST` | `/api/members/invitations` | Invite a team member |
| `PATCH` | `/api/members/:membershipId` | Change role or membership state |

### Agents and knowledge

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/agents` | List organization agents |
| `POST` | `/api/agents` | Provision an agent from an approved template |
| `GET` | `/api/agents/:agentId` | Return desired and confirmed configuration |
| `PATCH` | `/api/agents/:agentId` | Update and synchronize configuration |
| `POST` | `/api/agents/:agentId/activate` | Activate a configured agent |
| `POST` | `/api/agents/:agentId/pause` | Pause the agent when supported |
| `POST` | `/api/agents/:agentId/test-call` | Start a supported simulation or test call |
| `GET` | `/api/agents/:agentId/knowledge` | List knowledge documents |
| `POST` | `/api/agents/:agentId/knowledge` | Upload and synchronize a document |
| `DELETE` | `/api/agents/:agentId/knowledge/:documentId` | Remove a document |

Long-running provisioning endpoints should return `202 Accepted` with an operation resource:

```json
{
  "operation": {
    "id": "op_01J...",
    "type": "agent.provision",
    "status": "pending"
  }
}
```

### Calls

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/calls` | Paginated, filterable call history |
| `GET` | `/api/calls/:callId` | Call details, outcomes, summary, and timeline |
| `GET` | `/api/calls/:callId/transcript` | Authorized transcript access |
| `GET` | `/api/calls/:callId/recording` | Short-lived media URL or authorized stream |
| `POST` | `/api/calls` | Start an authorized outbound call when enabled |
| `GET` | `/api/calls/export` | Asynchronous or streamed filtered export |

Suggested call-list filters:

```text
?cursor=...
&limit=50
&from=2026-07-01T00:00:00Z
&to=2026-08-01T00:00:00Z
&direction=inbound
&outcome=appointment_booked
&agent_id=...
&location_id=...
&search=...
```

Use cursor pagination. Do not return complete transcripts or recording URLs in list responses.

### Contacts, leads, and appointments

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/contacts` | Search tenant contacts |
| `GET` | `/api/leads` | Read the persisted lead pipeline |
| `PATCH` | `/api/leads/:leadId` | Update stage, owner, value, and notes |
| `GET` | `/api/appointments` | Read appointments for a date range |
| `POST` | `/api/appointments` | Check and create a conflict-safe booking |
| `PATCH` | `/api/appointments/:appointmentId` | Reschedule or update a booking |
| `DELETE` | `/api/appointments/:appointmentId` | Cancel a booking |
| `GET` | `/api/availability` | Return tenant-safe appointment slots |

Appointment mutations should accept an idempotency key because callers, providers, and users can retry the same booking.

### Integrations

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/integrations` | Return connection status without secrets |
| `POST` | `/api/integrations/:provider/connect` | Begin an OAuth or guided connection flow |
| `GET` | `/api/integrations/:provider/callback` | Validate OAuth state and store encrypted credentials |
| `POST` | `/api/integrations/:provider/sync` | Schedule a manual reconciliation |
| `DELETE` | `/api/integrations/:provider` | Revoke and disconnect an integration |

OAuth `state` must be signed, short-lived, single-use, and bound to both the authenticated user and organization.

### Billing and usage

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/subscription` | Current plan, status, usage, and entitlements |
| `POST` | `/api/subscription/checkout` | Start checkout when ReceptAI owns billing |
| `POST` | `/api/subscription/portal` | Create an authenticated customer-portal session |
| `GET` | `/api/usage` | Return normalized usage and included limits |

### Webhooks

| Method | Route | Authentication |
|---|---|---|
| `POST` | `/api/webhooks/synthflow` | Synthflow signature verification |
| `POST` | `/api/webhooks/stripe` | Stripe signature verification |
| `POST` | `/api/webhooks/hubspot` | HubSpot signature verification |
| `POST` | `/api/webhooks/calendar/:provider` | Provider channel/token verification |
| `POST` | `/api/webhooks/twilio` | Twilio signature verification |

Webhook endpoints are public only in the network sense. They must not accept an event until provider authenticity has been verified.

## Internal provider adapters

Keep provider payloads behind typed interfaces so application services are not coupled to a single vendor.

```ts
interface VoicePlatform {
  createWorkspace(input: CreateWorkspaceInput): Promise<ProviderWorkspace>;
  createAgent(input: CreateAgentInput): Promise<ProviderAgent>;
  updateAgent(providerAgentId: string, patch: AgentPatch): Promise<ProviderAgent>;
  assignPhoneNumber(input: AssignNumberInput): Promise<ProviderPhoneNumber>;
  startTestCall(input: TestCallInput): Promise<ProviderCall>;
  getCall(providerCallId: string): Promise<ProviderCall>;
  getUsage(window: UsageWindow): Promise<ProviderUsage>;
}

interface CalendarProvider {
  getAvailability(input: AvailabilityInput): Promise<AvailableSlot[]>;
  createAppointment(input: AppointmentInput): Promise<ProviderAppointment>;
  updateAppointment(providerId: string, patch: AppointmentPatch): Promise<ProviderAppointment>;
  cancelAppointment(providerId: string): Promise<void>;
}

interface CrmProvider {
  upsertContact(input: ContactInput): Promise<ProviderContact>;
  upsertLead(input: LeadInput): Promise<ProviderLead>;
  pullChanges(cursor?: string): Promise<ChangePage>;
}
```

Adapters must translate provider errors into stable internal categories such as `authentication_required`, `rate_limited`, `validation_failed`, `conflict`, `retryable_provider_error`, and `permanent_provider_error`.

## Synthflow webhook processing

### Ingress requirements

1. Apply a bounded request-size policy that can still accommodate large transcripts; Synthflow documents no fixed maximum post-call payload size.
2. Preserve the body in access-controlled storage for debugging and audit when policy allows.
3. Extract and validate `call_id` without trusting any tenant mapping in the payload.
4. Read `HTTP_SYNTHFLOW_SIGNATURE`.
5. Calculate a base64-encoded HMAC-SHA256 signature over `call_id` with the webhook secret.
6. Compare the supplied and calculated signatures in constant time.
7. Apply ReceptAI-owned idempotency and replay protection. Synthflow does not currently document a timestamp-based replay scheme for this signature.
8. Insert a `webhook_receipts` row under a uniqueness constraint, using `call_id`, event type, and a deterministic digest as needed.
9. Return a successful acknowledgement after durable receipt.
10. Process normalization and downstream actions asynchronously.

Keep this implementation behind a versioned verifier and re-check [Synthflow's security documentation](https://docs.synthflow.ai/security) when implementing or upgrading it.

### Canonical internal event

```json
{
  "id": "evt_01J...",
  "organizationId": "org_01J...",
  "provider": "synthflow",
  "providerEventId": "provider-event-id",
  "type": "call.completed",
  "occurredAt": "2026-07-23T15:10:00Z",
  "subject": {
    "type": "call",
    "providerId": "provider-call-id"
  },
  "payloadVersion": 1
}
```

Store the encrypted or access-controlled raw payload separately from the normalized event. Normalized records should tolerate repeated and out-of-order delivery.

### Post-call work

A `call.completed` worker can:

1. Upsert the call and participants.
2. Store transcript, summary, outcome, extracted fields, and analytics.
3. Register the recording reference without exposing it publicly.
4. Create or update the lead.
5. Reconcile any appointment created during the call.
6. Enqueue CRM synchronization.
7. Enqueue consented confirmations or follow-up messages.
8. Add immutable usage entries.
9. Notify permitted dashboard users.

Each step needs its own idempotency key so one downstream failure does not duplicate successful work.

## Calendar integration

Start with one provider and implement the shared adapter before adding more.

Required OAuth scopes should cover only:

- Reading the selected calendar and free/busy data
- Creating, updating, and deleting ReceptAI-managed events
- Receiving event-change notifications when supported

Store:

- Provider account and calendar IDs
- Encrypted access and refresh tokens
- Token expiry
- Granted scopes
- Connection health and last successful sync
- Webhook channel/subscription expiry

Booking must account for time zones, daylight-saving changes, working hours, buffers, appointment duration, existing events, service-area rules, and concurrent retries.

## CRM integration

Choose HubSpot or GoHighLevel first rather than building both simultaneously.

The connection needs:

- Tenant OAuth or provider-supported account authorization
- Explicit field mappings
- Stable provider object IDs
- Incremental synchronization cursors
- Webhook processing
- Retry and dead-letter handling
- A documented conflict policy

ReceptAI should remain the source of truth for calls and voice-derived activity. The CRM can be the source of truth for sales ownership or pipeline stage if that product decision is made explicitly.

## Billing integration

### Option A: Synthflow Stripe rebilling

Use when the white-label plan supports the required pricing, included minutes, and overage model. This is the shortest path to a reseller MVP.

### Option B: ReceptAI-managed Stripe

Use when ReceptAI needs custom checkout, coupons, taxes, invoices, entitlement logic, or multiple upstream cost providers.

For either option:

- Subscription webhooks are authoritative.
- Checkout redirects are not proof of payment.
- Webhook events are signature-verified and idempotent.
- Usage is written to an immutable ledger.
- Entitlements are derived from subscription state and plan version.
- Billing reconciliation runs on a schedule.

## LLM strategy

### MVP

No direct LLM API is required if Synthflow supplies the conversational model, transcription, standard summaries, sentiment, extraction, and knowledge retrieval needed by the product.

Model selection and prompt configuration then live in the Synthflow agent definition. ReceptAI stores a safe, versioned projection of the desired configuration and never exposes provider credentials.

### Optional direct LLM

Add a server-side LLM only for a specific gap, such as:

- Domain-specific structured extraction
- Quality assurance and policy checks
- Custom summaries or classifications
- Prompt evaluation and improvement
- Knowledge-document processing
- A separate authenticated dashboard assistant

Any direct LLM pipeline must have:

- Schema-constrained outputs
- Tenant and purpose authorization
- PII minimization and redaction
- Prompt and model versioning
- Token, latency, and cost budgets
- Evaluation datasets and acceptance thresholds
- Provider retention and regional-processing review
- Audit records without logging sensitive prompt contents indiscriminately

## MCP strategy

MCP is optional and server-side:

| MCP use | Recommendation |
|---|---|
| Browser-to-provider integration | Do not use |
| Customer calendar or CRM OAuth | Use direct provider APIs |
| Synthflow runtime call handling | Use APIs, actions, and webhooks; MCP Actions are optional for an existing governed tool server |
| Development and database administration | MCP can assist authorized operators |
| Internal support or provisioning copilot | MCP can expose governed tools |
| Customer-facing AI operator | Consider only after auth, tenant scoping, approvals, and audit are mature |

An MCP server does not replace authorization. Every MCP tool that can read or mutate tenant data must receive an authenticated tenant context, validate permissions, constrain its inputs, and create audit events.

## Secrets and configuration

Suggested server-side configuration names:

```text
APP_BASE_URL
DATABASE_URL
SESSION_SECRET
FIELD_ENCRYPTION_KEY

SYNTHFLOW_API_BASE_URL
SYNTHFLOW_API_KEY
SYNTHFLOW_WEBHOOK_SECRET

STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET

GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
HUBSPOT_CLIENT_ID
HUBSPOT_CLIENT_SECRET

TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
```

Only public, non-sensitive build configuration may use Vite-exposed variables. Never prefix server credentials with `VITE_`.

Use separate credentials per environment. Document ownership and rotation procedures without committing actual values or `.env` files.

## Error handling and rate limits

- Set explicit connect and request timeouts.
- Retry only rate limits, timeouts, and documented transient failures.
- Honor provider retry headers.
- Use exponential backoff with jitter and bounded attempts.
- Do not retry validation, authorization, or most `4xx` failures automatically.
- Apply organization-level quotas to expensive operations.
- Return stable application error codes without leaking provider secrets or raw responses.
- Surface integration health and actionable reconnect states in the dashboard.

## Feature readiness checklist

A feature is production-ready only when:

- The dashboard is backed by an authenticated API.
- Tenant authorization is tested.
- Provider credentials remain server-side.
- Provider errors and rate limits are handled.
- Webhooks are verified and idempotent.
- Retries cannot create duplicate customer-visible actions.
- Audit events exist for sensitive changes.
- Logs exclude secrets and unnecessary PII.
- Loading, empty, error, stale, and reconnect states are designed.
- The feature has staging coverage with provider test resources.
- Operational alerts and a recovery procedure exist.

## Recommended integration order

1. Authentication, organizations, memberships, and database authorization
2. Synthflow credentials, subaccounts, agent provisioning, and webhooks
3. Real call history, transcripts, outcomes, usage, and secure recordings
4. Calendar OAuth, availability, booking, and reconciliation
5. Subscription billing and entitlements
6. CRM synchronization
7. SMS and email automation
8. Agent test calls, knowledge base, analytics, and notifications
9. Optional direct LLM processing
10. Optional internal MCP-based operations assistant
