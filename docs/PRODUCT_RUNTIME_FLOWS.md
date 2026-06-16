
---

# 3. `PRODUCT_RUNTIME_FLOWS.md`

```md
# PRODUCT RUNTIME FLOWS

## 1. Purpose
Defines how the product behaves in real-world usage from first visit to long-term retention.

---

## 2. Core Principle

> Every user must reach “first value moment” in under 3 minutes.

First value moment = first meaningful match or insight.

---

## 3. User Lifecycle Flow

### Stage 1: Entry
User arrives via:
- SEO
- referral
- direct

System actions:
- detect intent
- preload onboarding context

---

### Stage 2: Signup
Flow:
AUTH_SYSTEM → user creation → session init

Rules:
- no friction authentication
- social login preferred

---

### Stage 3: Onboarding

ONBOARDING_SYSTEM:
- collects preferences
- personality signals
- goals

AI_SYSTEM:
- enriches profile
- predicts matching profile type

Exit condition:
- onboarding completion OR skip threshold reached

---

### Stage 4: First Value Moment

Triggered by:
- first match shown OR
- first AI recommendation accepted

System:
ONBOARDING_SYSTEM → MATCHING_ENGINE → AI_SYSTEM

Rule:
- must happen < 180 seconds

---

### Stage 5: Engagement Loop

Loop:

1. USER opens dashboard
2. MATCHING_ENGINE generates new matches
3. AI_SYSTEM refines suggestions
4. USER interacts (accept/reject/message)
5. system learns preferences

---

### Stage 6: Monetization Trigger

Triggered when:
- user hits engagement threshold OR
- premium feature gate reached

Flow:
DASHBOARD_SYSTEM → SUBSCRIPTION_SYSTEM

Rules:
- never block core value before first success
- paywall only after demonstrated value

---

### Stage 7: Retention System

Mechanisms:
- daily match refresh
- AI nudges
- email/notification loops
- “missed connection” recovery

---

## 4. Failure Handling

### AI Failure
→ fallback: rule-based matching

### No Matches Found
→ expand search radius + relax constraints

### Subscription Failure
→ downgrade gracefully to free tier

### Onboarding Drop-off
→ resume state saved + simplified flow

---

## 5. Behavioral Loops

### Loop 1: Discovery Loop
User sees matches → interacts → improves AI → better matches

### Loop 2: Social Loop
Match → conversation → retention → more matching

### Loop 3: Monetization Loop
Value perceived → upgrade → enhanced AI → better value

---

## 6. Design Constraints

- No dead ends in UX
- Every screen must lead to action
- AI must always provide fallback output
- System must assume partial user data
