# SYSTEM INTEGRATION MAP

## 1. Overview
Aceasta este harta de integrare a tuturor sistemelor din platforma Partnerly.
Scopul: să definească clar cum circulă datele și deciziile între module.

---

## 2. Core Systems

### 2.1 Authentication System → AUTH_SYSTEM
Responsabil pentru:
- signup / login / session management
- user identity persistence
- role management (user, premium, admin)

Output:
- user_id
- auth_token
- user_role

Consumatori:
- DASHBOARD_SYSTEM
- MATCHING_ENGINE
- SUBSCRIPTION_SYSTEM

---

### 2.2 AI System → AI_SYSTEM
Responsabil pentru:
- matching suggestions
- content generation
- onboarding assistance
- smart recommendations

Depinde de:
- USER_PROFILE
- MATCHING_DATA
- EVENT_HISTORY

Output:
- AI_MATCH_SUGGESTIONS
- AI_INSIGHTS
- AI_ONBOARDING_RESPONSES

Consumatori:
- MATCHING_ENGINE
- ONBOARDING_SYSTEM
- DASHBOARD_SYSTEM

---

### 2.3 Matching Engine → MATCHING_ENGINE
Responsabil pentru:
- user-to-user matching
- scoring compatibility
- ranking results

Depinde de:
- USER_PROFILE
- BEHAVIORAL_DATA
- AI_SUGGESTIONS

Output:
- MATCH_LIST
- COMPATIBILITY_SCORE

Consumatori:
- DASHBOARD_SYSTEM
- NOTIFICATION_SYSTEM

---

### 2.4 Subscription System → SUBSCRIPTION_SYSTEM
Responsabil pentru:
- payment plans
- premium gating
- billing lifecycle

Output:
- subscription_status
- access_level

Consumatori:
- AUTH_SYSTEM
- DASHBOARD_SYSTEM
- FEATURE_FLAGS

---

## 3. Data Flow (E2E)

### Flow 1: New User Activation
AUTH_SYSTEM → ONBOARDING_SYSTEM → AI_SYSTEM → MATCHING_ENGINE → DASHBOARD_SYSTEM

### Flow 2: Premium Upgrade
DASHBOARD_SYSTEM → SUBSCRIPTION_SYSTEM → FEATURE_FLAGS → AI_SYSTEM (enhanced mode)

### Flow 3: Daily Usage Loop
DASHBOARD_SYSTEM → MATCHING_ENGINE → AI_SYSTEM → NOTIFICATIONS → DASHBOARD_SYSTEM

---

## 4. Critical Rules
- AI_SYSTEM cannot directly modify database
- MATCHING_ENGINE is deterministic + AI-assisted, not AI-driven
- SUBSCRIPTION_SYSTEM is source of truth for access control
- AUTH_SYSTEM is single source of identity

---

## 5. Failure Isolation
- AI failure → fallback to rule-based matching
- Matching failure → show last cached matches
- Subscription failure → default to free tier
