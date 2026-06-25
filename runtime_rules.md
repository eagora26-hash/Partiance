# 99_RUNTIME_RULES.md

# PARTIANCE - RUNTIME EXECUTION RULES

These are execution rules.

These rules have higher priority than implementation preferences.

---

# CONTEXT AWARENESS

Before implementing anything:

* Always inspect the existing codebase.
* Always inspect existing components.
* Always inspect existing pages.
* Always inspect existing systems.
* Always inspect existing documentation.

Never assume.

Never overwrite existing logic without analysis.

Always understand the current state first.

---

# PROJECT MEMORY

Partiance is a long-term project.

Act as if you have persistent memory.

Before creating anything:

1. Search if it already exists.
2. Re-read related files.
3. Re-use existing architecture.
4. Re-use existing components.
5. Re-use existing utilities.
6. Re-use existing styles.

Never duplicate systems.

Always preserve consistency.

---

# FILE AWARENESS

Whenever modifying a feature:

Always inspect all related files first.

Example:

If editing Dashboard:

* inspect Dashboard components
* inspect Dashboard layout
* inspect Dashboard hooks
* inspect Dashboard translations
* inspect Dashboard types
* inspect Dashboard services

Then implement.

Never work blindly.

---

# GRAPH THINKING

Use Graph Thinking for every implementation.

Think in relationships.

Every system affects other systems.

Map dependencies before coding.

Always think about:

Frontend

Backend

Database

AI

SEO

Internationalization

Responsiveness

Accessibility

Performance

Analytics

Subscriptions

Notifications

Future scalability

Never build isolated systems.

---

# MCP USAGE

21st.dev MCP is available.

Always use it before creating custom UI components.

Workflow:

1. Search for existing premium components.
2. Adapt them to Partiance.
3. Customize them.
4. Never copy them directly.

Use 21st.dev only as inspiration.

Maintain Partiance's unique identity.

---

# AVAILABLE SKILLS

Installed skills:

Impeccable

UI/UX Pro

Use them whenever designing pages.

Apply them proactively.

Do not wait for explicit instructions.

---

# DOCKER

Always think Docker-first.

Everything must be container-friendly.

Keep environments reproducible.

Avoid machine-specific configurations.

Use environment variables.

Prepare the project for deployment from day one.

---

# MOBILE FIRST

Mobile is mandatory.

Desktop is mandatory.

Tablet is mandatory.

Never create desktop-only experiences.

---

# INTERNATIONALIZATION

Italy first.

English second.

Every feature must support:

Italian

English

Never hardcode text.

---

# PERFORMANCE FIRST

Avoid unnecessary dependencies.

Avoid unnecessary animations.

Optimize images.

Lazy load where appropriate.

Code split where appropriate.

Keep bundles small.

---

# BEFORE EVERY IMPLEMENTATION

Always output internally:

1. Analyze current state
2. Inspect dependencies
3. Re-read related files
4. Plan architecture
5. Plan UX
6. Plan responsiveness
7. Plan performance
8. Implement
9. Refactor
10. Verify consistency

Never skip these steps.

---

# FINAL RULE

Do not behave like an AI assistant.

Behave like a senior autonomous product team maintaining a production-grade startup.
# PRODUCTION GRADE PRODUCT RULE

Partiance is NOT a concept.

Partiance is NOT a prototype.

Partiance is NOT a UI showcase.

Partiance is NOT a portfolio project.

Partiance is NOT a design exercise.

Partiance MUST be a real production-grade platform.

Everything built must be functional.

Always think end-to-end.

Every feature must be connected to the real application ecosystem.

Always build the complete stack.

Every system must have:

* Frontend
* Backend
* Database
* API layer
* Authentication
* Authorization
* Security
* Internationalization
* Analytics
* Error handling
* Logging
* Monitoring
* Responsiveness

Never build fake features.

Never build static demos.

Never build isolated screens.

Never build UI without functionality.

Never build placeholder systems.

Every page must connect to real data.

Every feature must connect to real services.

Every action must have a backend flow.

Every backend flow must have database support.

Every database flow must have validation.

Every user action must be traceable.

Always think in production.

---

# FULL STACK MANDATORY ARCHITECTURE

Partiance must always include:

Frontend

* Next.js 15
* React 19
* TypeScript
* Tailwind CSS v4

Backend

* API layer
* Services
* Business logic
* Validation

Database

* PostgreSQL
* Supabase

Authentication

* Clerk

Payments

* Stripe

AI

* External AI providers
* AI orchestration layer

Storage

* Supabase Storage

Emails

* Resend

Analytics

* PostHog

Monitoring

* Sentry

Caching

* Redis when necessary

Deployment

* Docker

---

# PRODUCTION THINKING

Before implementing anything, ask:

How is the data stored?

How is the data retrieved?

Who can access it?

How is it secured?

How is it validated?

How is it translated?

How is it monitored?

How is it tracked?

How does it scale?

How will this work with 100,000 users?

How will this work with 1 million users?

---

# AUTHENTICATION RULES

Always implement:

Register

Login

Logout

Session management

Email verification

Password reset

2FA support

Protected routes

Role management

Permissions

Rate limiting

Anti spam

---

# DATABASE RULES

Never store temporary mock data.

Always build real schemas.

Always normalize data.

Always define relationships.

Always define indexes.

Always define constraints.

Always think about scalability.

---

# API RULES

Never directly couple UI to the database.

Always use a service layer.

Always validate requests.

Always validate responses.

Always handle errors.

Always create reusable APIs.

---

# PAYMENT RULES

Subscriptions must be real.

Stripe integration must support:

Free

Premium

Business

Handle:

Upgrade

Downgrade

Cancel

Renew

Failed payments

Webhooks

Invoices

Billing history

---

# SECURITY RULES

Security is mandatory.

Always implement:

Input validation

Output sanitization

Rate limiting

Protected APIs

Role permissions

Session security

Audit logs

Anti abuse systems

Environment variables

Secrets management

Never expose keys.

---
# DEPLOYMENT & PRODUCTION OPERATING RULES

Partiance must always remain deployable.

Never build a codebase that only works locally.

Everything must be production-ready from day one.

Think deployment-first.

---

# DOCKER FIRST

Every system must be containerized.

Always maintain a healthy Docker architecture.

Always keep Docker synchronized with the project.

Whenever a new service is added:

- Update Docker configuration
- Update environment variables
- Update dependencies
- Verify compatibility

The entire project must be runnable with a single command.

Example:

docker compose up -d

Never rely on machine-specific configurations.

Never rely on manually installed dependencies.

---

# PROJECT STRUCTURE DISCIPLINE

Keep a clean enterprise structure.

Do not create random files.

Do not create random folders.

Do not duplicate logic.

Every file must have a clear responsibility.

Keep business logic separated from UI.

Keep APIs separated from components.

Keep services separated from pages.

Keep AI separated from frontend logic.

Keep configurations centralized.

Keep the codebase maintainable.

---

# PRODUCTION CHECK RULE

Before marking any feature as complete, verify:

✓ Frontend works

✓ Backend works

✓ Database works

✓ API works

✓ Authentication works

✓ Permissions work

✓ Translations work

✓ Responsiveness works

✓ Error handling works

✓ Logging works

✓ Docker still works

✓ Build still works

✓ Deploy still works

✓ TypeScript still passes

✓ Performance is acceptable

✓ No duplicate code was introduced

If one fails, the feature is NOT complete.

---

# BUILD VALIDATION RULE

After every important implementation:

Run checks.

Never assume.

Always verify.

Mandatory checks:

Type check

Lint

Build

Docker build

Docker compose

Environment variables

Imports

Broken routes

Translations

Authentication flow

Database connections

---

# TECHNICAL DEBT RULE

Never postpone obvious problems.

Do not accumulate technical debt.

Refactor immediately when necessary.

Small fixes now are cheaper than large fixes later.

---

# SCALABILITY RULE

Do not build for today.

Build for 10x growth.

Every decision must survive:

10 users

1,000 users

10,000 users

100,000 users

1,000,000 users

If architecture will break, redesign before implementing.

---

# FINAL RULE

Partiance must always be in a deployable state.

At any moment, the entire application should be able to be cloned, configured and deployed by another engineer without additional explanations.

Do not build an application.

Build a real company infrastructure.

Build Partiance as if it will launch publicly in Italy tomorrow.
