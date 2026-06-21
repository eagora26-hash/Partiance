# METRICS & EVENTS SYSTEM

## 1. Purpose
Defines all measurable system behaviors, events, and KPIs for Partiance.

---

## 2. North Star Metric

### PRIMARY METRIC:
**Successful Connections per Active User (SCAU)**

Definition:
- A “successful connection” = mutual match + interaction within 7 days

---

## 3. Key Metrics Layers

### 3.1 Acquisition Metrics
- `sign_up_conversion_rate`
- `landing_page_to_signup`
- `seo_to_signup_ratio`

---

### 3.2 Activation Metrics
- `onboarding_completion_rate`
- `time_to_first_match`
- `first_ai_interaction_rate`

---

### 3.3 Engagement Metrics
- `daily_active_users`
- `matches_viewed_per_session`
- `messages_sent_per_match`

---

### 3.4 Retention Metrics
- `d1_retention`
- `d7_retention`
- `d30_retention`
- `churn_rate`

---

### 3.5 Revenue Metrics
- `free_to_premium_conversion_rate`
- `ARPU`
- `LTV`
- `refund_rate`

---

## 4. Event Tracking Schema

### Core Events

#### AUTH EVENTS
- `user_signed_up`
- `user_logged_in`
- `user_verified_email`

#### ONBOARDING EVENTS
- `onboarding_started`
- `onboarding_completed`
- `preferences_set`

#### MATCHING EVENTS
- `match_generated`
- `match_viewed`
- `match_accepted`
- `match_rejected`

#### AI EVENTS
- `ai_suggestion_requested`
- `ai_response_generated`
- `ai_fallback_triggered`

#### SUBSCRIPTION EVENTS
- `subscription_started`
- `subscription_upgraded`
- `subscription_cancelled`

---

## 5. Event Payload Standard

All events must follow:

```json
{
  "event_name": "",
  "user_id": "",
  "timestamp": "",
  "session_id": "",
  "metadata": {}
}
