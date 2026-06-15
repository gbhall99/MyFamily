# MyFamily — Product & Feature Specification

> **One line:** The first family app that doesn't wait to be told. MyFamily is an AI
> "family operating system" that proactively carries the mental load — anticipating,
> organizing, and quietly *doing* the logistics of family life so parents can be present.

**Status:** Draft for review · **Scope:** Product & features (mobile-first, cross-platform) ·
**Audience:** All family types, beachhead = the "default parent"

---

## 1. The opportunity

### 1.1 The market
The parenting/family-app market is ~**$1.7B (2025)** growing to ~**$4.9B by 2035**
(~11% CAGR). It's large, growing, and — critically — **commoditized at the feature level**.
Everyone has a shared calendar, lists, and chores. Nobody has solved the actual problem.

### 1.2 The real problem: the mental load
The "mental load" (a.k.a. invisible labor) is the unpaid, unseen work of *anticipating,
deciding, and orchestrating* family life: noticing the dentist is due, that the cleats are
outgrown, that two events collide on Thursday, that Grandma's prescription needs a refill.
Research and reporting consistently show this load falls on one "default parent," drives
real stress and burnout, and **is not relieved by today's apps** — because those apps are
passive containers that require *more* data entry from the very person who's already
overloaded.

### 1.3 Why current apps fail (the gap)
- **They store, they don't think.** A calendar only helps if you already know what to put in it.
- **Single-user gravity.** One parent enters everything; everyone else "forgets their login," and the system crumbles.
- **Feature sprawl.** Endless tabs and settings add cognitive load instead of removing it.
- **Reactive AI at best.** The new AI entrants (Maple, Ohai) parse emails into events and suggest meals — useful, but still fundamentally *assistive*, not *autonomous*. They wait to be asked.

**The wedge:** Move from *organizing information* → to *carrying responsibility*. An app that
**notices, decides, drafts, and acts** — then asks for a tap of approval — is a categorical
leap, not a feature upgrade.

---

## 2. Competitive landscape

| App | Strength | Core weakness MyFamily exploits |
|---|---|---|
| **Cozi** | Best-in-class simple shared calendar, lists, weekly agenda email | Passive; paywalled basic calendar views (2024); zero intelligence |
| **FamilyWall** | Broadest feature set — calendar, chat, location, photos, budget | Kitchen-sink complexity; features don't talk to each other; passive |
| **OurHome** | Gamified chores/points for kids | Narrow; no real planning or intelligence |
| **Maple** | Genuinely useful AI: email→events, meal planning; great design | Assistive not autonomous; no expenses; single-household; you still drive |
| **Ohai.ai** | Conversational SMS/email assistant; scans school emails/PDFs → calendar; Instacart meals | Text-thread UX limits richness; assistant ≠ shared family system; reactive |

**Synthesis:** Cozi/FamilyWall own *breadth-but-passive*. Maple/Ohai own *AI-but-assistive*.
**Nobody owns *proactive + autonomous + whole-family*.** That's the MyFamily position.

---

## 3. Vision & principles

### 3.1 North-star
> Every family runs on an invisible to-do list living in one person's head.
> **MyFamily's job is to take that list out of their head and quietly handle it.**

### 3.2 Product principles
1. **Anticipate, don't ask.** Default to surfacing the next right thing before the user thinks of it.
2. **One tap beats one form.** Every proactive suggestion is approvable/editable in a single gesture. Capture is conversational or automatic, never a 9-field form.
3. **Shared by design, not by nagging.** Eliminate single-user gravity: the app distributes load *for* the family rather than relying on everyone to log in.
4. **Earn trust, then earn autonomy.** Start by suggesting; graduate to acting on a per-task basis as the family grants permission. Never act irreversibly without consent.
5. **Calm software.** Fewer tabs, one intelligent home surface. Complexity hides behind the assistant.
6. **Safe for the whole family.** Kids' data minimized and protected by default; age-appropriate surfaces; transparent and revocable AI actions.

---

## 4. Who it's for (personas)

The product is **broad** but enters through the overloaded parent. Each persona unlocks more of the same engine.

- **Maya — the Default Parent (beachhead).** Works, two school-age kids. Carries 90% of the logistics. Wants the load *off her head*, and her partner actually participating.
- **Devin — the Under-contributing Partner.** Willing but "didn't know." Needs frictionless, assigned, in-context nudges — not a second job.
- **Taylor — the Teen.** Privacy-sensitive; lives in messages. Needs autonomy, light-touch reminders, and a reason to engage (rides, money, plans).
- **The Co-parents (separated).** Need a neutral shared schedule, custody handoffs, and transparent expense-splitting without talking to each other more than necessary.
- **The Sandwich-Gen Caregiver.** Coordinating kids *and* aging parents — meds, appointments, and splitting eldercare tasks with siblings.
- **Grandparent / extended circle.** Light, invited participation: see the kids' calendar, get photos, help with a pickup.

---

## 5. The architecture of the experience (product-level)

Three layers the user actually feels:

1. **The Family Brain** — a living, shared memory of the household: people, relationships,
   routines, preferences, locations, providers (doctors, school, coach), recurring
   obligations, and history. It's what makes proactivity possible: the app already *knows*
   the dentist is every 6 months and that Leo hates broccoli.
2. **The Surfaces** — where families interact: a single intelligent **Today** home, plus
   focused spaces (Calendar, Meals, Tasks, Money, People). Mobile-first; also widgets,
   watch, voice, and a shared "family display" mode for the fridge tablet.
3. **The Agents** — proactive workers that watch the Brain and the world (calendars,
   inboxes, weather, school portals) and produce **drafts and actions** for approval. This
   is the "wow."

---

## 6. Feature pillars

Each pillar is framed in three tiers: **① Table stakes** (match the market) → **② AI next
level** (intelligence) → **③ Agentic next level** (it acts). The agentic tier is the
differentiator.

### 6.1 The Family Brain & Capture
- **①** Profiles for each member, relationships, contacts, important dates.
- **②** **Universal capture:** snap a photo of a flyer/permission slip, forward an email, paste a text, or just *talk* — the app extracts events, tasks, contacts, and files them. No forms. (Maple/Ohai do a version of this; MyFamily makes it the primary input for everything.)
- **③** The Brain **self-maintains**: detects that "Dr. Lee" on the invoice is the same dentist, that swim moved to Thursdays, that Leo outgrew last year's shoe size — and updates itself, flagging only what's ambiguous.

### 6.2 Calendar & Scheduling
- **①** Shared color-coded family calendar; two-way sync with Google/Apple/Outlook; reminders.
- **②** **Conflict radar:** detects collisions and impossible logistics (two kids, two fields, one car, overlapping times) *before* they happen and explains the conflict in plain language.
- **③** **Auto-resolve & coordinate:** proposes the fix — who drives whom, a carpool ask drafted to another parent, a rescheduling message to the coach, a backup sitter pinged — and executes on approval. Handles the *"who's covering pickup?"* negotiation autonomously.

### 6.3 Tasks, Chores & **Mental-Load Balancing** (signature)
- **①** Assignable tasks/chores, recurring, with reminders; kid points/rewards (OurHome-style).
- **②** **Auto-generated tasks:** the app *creates* the to-dos you'd otherwise have to remember — "RSVP to the party by Fri," "buy a gift," "renew passport (expires in 9 mo, before summer trip)."
- **③** **The Fair-Share engine** — the feature no competitor has. MyFamily *measures* the invisible load (who's carrying what, including the anticipatory/cognitive work), visualizes the imbalance, and **proactively redistributes**: it assigns the next task to the under-loaded partner, in-context, with everything they need to do it ("Here's the form, the deadline, and the link — tap to take it"). Directly attacks the "only mom uses it / default-parent" failure mode.

### 6.4 Meals, Groceries & Provisioning
- **①** Meal planner, recipe box, shared grocery list.
- **②** AI meal plans from the family's real constraints: dietary needs, who's home each night, the schedule (slow-cooker on late-practice nights), budget, and what's already in the pantry.
- **③** **Closed-loop kitchen:** builds the plan → generates the cart → **places the grocery order** (Instacart-style) → adjusts when Thursday's plan changes → learns ratings to improve. Tracks staples and **reorders before you run out**.

### 6.5 Communication & Coordination
- **①** In-app family chat; announcements.
- **②** **Context-aware threads:** messages attach to the event/task/person ("the soccer thread" auto-includes the schedule, location, carpool, and weather). AI **summarizes** the noisy school/team group chats into "what actually matters to you."
- **③** **Drafts & sends on your behalf:** writes the RSVP, the "running 10 min late" text, the thank-you note, the request to swap pickups — you approve. **Neutral co-parent comms:** rephrases tense messages and keeps a shared, factual record.

### 6.6 Inbox, Documents & Information Triage
- **①** Document storage; family email inbox (Maple-style).
- **②** **The school/activity firehose, tamed:** connects to email + school/sports portals, reads newsletters/PDFs/notices, and extracts the 3 things that need *action* from the 50 that don't — turning them into dated, assigned tasks and events.
- **③** **Autonomous filing & follow-through:** files the medical record, tracks the permission slip until it's signed, remembers the warranty, surfaces the doc *at the moment you need it* (pulls up the insurance card in the ER waiting room).

### 6.7 Kids, School & Activities
- **①** Per-child schedules, school calendar, activity tracking.
- **②** **Child timeline & milestones:** growth, health, school, sports in one place; proactive reminders (well-visits, vaccinations, registration windows, sign-up deadlines that sell out).
- **③** **Activity concierge:** suggests age-appropriate activities/camps that *fit the calendar and budget*, drafts the registration, and books it. Discovers local options (e.g., weekend trails/outings) and assembles a ready-to-go plan.

### 6.8 Health & Wellbeing
- **①** Appointment reminders, medication/health notes per member.
- **②** **Whole-family health view:** appointments, meds, refills, symptoms; proactive "time to book the annual physical / flu shots / eye test."
- **③** **Books the appointment**, coordinates it against the family calendar, arranges the ride if needed, and prepares the visit (questions, history, insurance doc ready).

### 6.9 Money & Household Admin
- **①** Shared expenses, budgets, bill reminders (FamilyWall-style).
- **②** **Spots money leaks & deadlines:** renewals, subscriptions, due dates, allowance tracking; **fair expense-splitting** for co-parents with a clean ledger.
- **③** **Acts:** reminds-then-pays-on-approval, files reimbursement claims (e.g., medical/childcare), flags a cheaper plan, settles the co-parent balance.

### 6.10 Eldercare & Extended Family
- **①** Shared profiles/calendar for aging parents; invite siblings/grandparents with scoped access.
- **②** **Care coordination:** meds, appointments, and a shared log across siblings so nothing is dropped or doubled; surfaces "who's checking in this week."
- **③** **Distributes and follows up** on care tasks across the sibling group, arranges transport to appointments, and keeps an auditable care record.

### 6.11 Travel, Logistics & Memories
- **①** Trip planning notes, packing lists, shared photos/journal.
- **②** **Trip brain:** auto packing lists from the itinerary + weather + each member; holds confirmations/passports; coordinates pet/house/plant cover.
- **③** **Plans the trip end-to-end** within budget and calendar; arranges rides to the airport; auto-curates a road-trip playlist and a shared photo album, and turns the trip into a memory book afterward — so the app also creates *connection*, not just logistics.

---

## 7. The agentic layer — the "wow"

This is what makes MyFamily a category leap rather than a better Cozi.

### 7.1 The Family Co-pilot
A single conversational, proactive assistant (voice + chat + ambient) that any family
member can talk to in natural language: *"Sort out Leo's birthday party"* spawns a plan —
date against the calendar, venue options in budget, invite list from the Brain, drafted
invites, a gift task for the cousins, and a grocery order — presented as an approvable
checklist. It speaks each member's context (a teen asking "what's for dinner / can I get a
ride" gets answered from the same Brain).

### 7.2 Specialized background agents
Always-on workers that watch the Brain + the world and produce drafts/actions:
- **Scheduler agent** — conflict radar, carpool/coverage negotiation, rebooking.
- **Provisioner agent** — meals, groceries, household staples, reordering.
- **Inbox agent** — email/portal triage → tasks & events; follow-through on forms.
- **Load-balancer agent** — measures and redistributes the mental load (signature).
- **Health agent** — appointments, refills, well-visits.
- **Money agent** — bills, renewals, reimbursements, co-parent ledger.
- **Care agent** — eldercare coordination across siblings.

### 7.3 The Daily Brief (the habit loop)
Each morning (and an evening look-ahead), MyFamily delivers a single proactive briefing:
*today's logistics, the conflicts it caught, the 3 things needing a decision (one tap
each), what it already handled for you, and what's coming that you'd want lead time on.*
This replaces the parent's 6 a.m. mental scramble and is the core retention loop.

### 7.4 The autonomy ladder (trust model)
Every agent action runs at a family-set autonomy level, **per category**:
1. **Notify** — "heads up, the dentist is due."
2. **Suggest** — drafts it, you approve each time.
3. **Auto + undo** — does it and tells you, reversible within a window.
4. **Full auto** — trusted recurring actions (e.g., reorder dish soap) happen silently.

Autonomy is earned and always visible in an **activity log** ("Here's everything I did for
you"), fully revocable. This is how we get the magic of autonomy without the fear.

---

## 8. Solving adoption: killing single-user gravity

The #1 reason family apps die is that only one person uses them. MyFamily designs against this directly:
- **Zero-onboarding for non-primary members:** they don't have to *set up* anything — they receive assigned, in-context tasks and one-tap approvals via the channel they already use (push, and SMS/iMessage/WhatsApp fallback for the teen/grandparent who won't open the app).
- **The app does the data entry**, not the family — removing the very chore that burns people out.
- **Fair-Share visibility** creates gentle social accountability so load doesn't silently re-collapse onto one person.
- **Value on day one** via universal capture (snap one flyer → see magic) instead of an empty calendar to fill.

---

### 8.1 Onboarding flow (capture-first, value before setup)
1. **Land on value, not a form.** First run opens straight to capture: "Snap a flyer, forward an email, or just tell me what's going on." The first captured item is extracted and filed live — the "aha."
2. **Build the household by invitation, not data entry.** The primary user adds members by name + phone/email; the app pulls relationships and providers from captured items over time rather than asking for them up front.
3. **Connect a source (optional, skippable).** Offer one calendar/inbox connection to seed the Brain; never block first value on it.
4. **Set a starting autonomy level.** Default to **Suggest** for everything; explain the ladder in one sentence; let the family raise it later per category.
5. **Non-primary members never onboard.** They first appear in the system as the recipient of an assigned item via their own channel (see AC for §8). Opening the app is optional, not required.

### 8.2 Household & roles model
- **One household** contains **members**; members have a **role** that scopes what they see and can do: `owner/primary · co-parent · adult · caregiver · teen · child · grandparent/guest`.
- **Roles, not accounts, are the unit of access.** A member can participate (receive, act) by channel without an account; an account adds richer surfaces but is never required to be reached.
- **Multi-household & separated families:** a member (e.g., a child) can belong to two linked households with a shared, neutral subset (schedule, custody handoffs, expense ledger) and private remainders per household.
- **Scoped visibility** is enforced per role for each sensitivity class (general · personal · health · financial · location); the shared Family Display further hides sensitive classes by default.

## 9. UX & surfaces (mobile-first, cross-platform)

- **Primary:** iOS + Android, native-feeling, fast capture (camera, share-sheet, voice).
- **Home = "Today":** one intelligent surface — brief, conflicts, decisions, and the family timeline. Not a wall of tabs.
- **Focused spaces:** Calendar · Meals · Tasks/Load · Money · People/Care — each powered by the same Brain.
- **Companion surfaces:** home-screen/lock-screen **widgets**, **watch** (next thing + quick approve), **voice** (co-pilot), and a **Family Display** mode (kitchen tablet / shared screen).
- **Web companion** for heavier planning sessions.
- **Accessibility & calm:** large-touch, glanceable, low-notification — proactivity must reduce pings, not add them. Strict notification budgeting; the Brief consolidates.

### 9.1 Screen & surface inventory (product-level)
The shipped app is the following surfaces, all powered by the same Brain:
- **Today** (home) — the Daily Brief: logistics, caught conflicts, ≤3 one-tap decisions, "already handled," capture entry point.
- **Co-pilot** — conversational goal → approvable plan; per-member context.
- **Activity log** — "everything I did for you," with reason + undo per action.
- **Calendar** — shared, color-coded, two-way synced; conflict radar surfaced inline.
- **Tasks / Load** — assignable tasks + the Fair-Share balance view.
- **Meals** — plan → cart → order; pantry/staples.
- **Money** — shared expenses, bills, co-parent ledger.
- **People / Care** — member profiles, providers, health, eldercare log.
- **Capture sheet** — snap/voice/paste/forward → extracted item for one-tap filing.
- **Settings** — per-category autonomy ladder, privacy/roles, integrations.
- **Companion surfaces** — widgets, watch, voice, Family Display, web companion.
- Every screen ships its full state set (default · loading · empty · error) per DESIGN_SPEC §13.1.

### 9.2 Notifications & the calm budget
- **Default to zero net new notifications.** Non-urgent items roll into the Daily Brief; a feature may not raise the per-family notification count.
- **Only genuinely urgent, time-critical items push** (a conflict happening today, a same-day cancellation). Everything else defers.
- **Per-member, per-category controls** and quiet hours; the Brief is the consolidation point.
- **Channel-aware:** non-app members are reached via push or SMS/iMessage/WhatsApp; urgency rules apply across channels.

> **Design standard:** the binding UI/UX & graphic-design specification — visual identity, design
> system, interaction/motion, accessibility floor, age-appropriate UI, and design acceptance
> criteria — lives in **[`DESIGN_SPEC.md`](./DESIGN_SPEC.md)**. All UI work must adhere to it.

---

## 10. Trust, privacy & safety (non-negotiable foundation)

A family app holds the most sensitive data there is — children, location, health, finances.
Trust is the product.
- **Kids first / COPPA-aligned:** minimize data on under-13s, verifiable parental consent, clear retention disclosure, and **never use children's data for AI training** (aligns with 2026 COPPA updates). Age-appropriate surfaces and parental controls.
- **Teen privacy & autonomy:** older kids get scoped privacy (location/chat boundaries) — building trust, not surveillance.
- **Data minimization & encryption** for health, financial, and location data; granular, role-based access (what a grandparent or co-parent can see is tightly scoped).
- **Transparent, revocable AI:** every autonomous action is logged, explained, and undoable; autonomy is opt-in per category.
- **No selling data; no ad-targeting children.** Trust is monetized through subscription value, not surveillance.
- **Safety:** location-sharing is consensual and visible; sensitive co-parent comms are factual and logged for fairness.

---

## 11. Monetization

Freemium → subscription, matching proven family-app economics (market median ~$4.99/mo; family plans are ~25% of subscriptions).
- **Free:** shared calendar, lists, basic capture, limited AI — enough to get hooked.
- **MyFamily+ (~$7–12/mo or annual):** the agentic layer — proactive agents, unlimited capture, conflict auto-resolve, meal+grocery automation, Fair-Share, full integrations. Family plan covers the whole household.
- **Premium/Concierge tier (later):** higher autonomy, eldercare coordination, deeper booking/commerce.
- **Ethical commerce upside:** opt-in, transparent affiliate/fulfillment on actions the user already wanted (groceries, gifts, activities, rides) — value-aligned, never ad-driven or aimed at kids.
- **Pricing logic:** we charge for *load removed*, not features stored — justifying a premium above Cozi/FamilyWall ($40–45/yr) because we replace a part-time household manager.

---

## 12. Why this wins (differentiation summary)

| Dimension | Best competitor today | MyFamily |
|---|---|---|
| Core job | Store family info | **Carry the mental load** |
| Posture | Passive / assistive | **Proactive / agentic** |
| Data entry | The parent does it | **The app does it** |
| Load distribution | Manual assignment | **Measured & auto-balanced (Fair-Share)** |
| Breadth | Siloed features | **One Brain, all domains connected** |
| Action | Reminds you to act | **Acts for you (with approval)** |
| Adoption | Collapses to one user | **Designed for whole-family, zero-setup participation** |

---

## 13. Roadmap (phased)

- **Phase 0 — Wedge (MVP):** Universal capture + smart shared calendar + conflict radar + the Daily Brief + email/school triage. Prove "the app fills itself and catches what I'd miss."
- **Phase 1 — Load:** Auto-task generation, Fair-Share load-balancing, zero-setup partner/teen participation, context-aware comms with drafts.
- **Phase 2 — Provision & act:** Meals→grocery closed loop, staples reordering, health appointment booking, the autonomy ladder + activity log.
- **Phase 3 — Whole family:** Money/co-parent ledger, eldercare coordination, travel concierge, memories/connection, ambient surfaces (voice/watch/display).
- **Phase 4 — Concierge:** Higher autonomy, marketplace of family services, deeper proactive commerce.

---

## 14. Success metrics
- **North-star:** weekly *proactive actions accepted per family* (load removed), not DAU alone.
- **Adoption health:** # active members per household > 1.5 (anti single-user-gravity); % tasks completed by non-primary members (Fair-Share working).
- **Trust:** autonomy-level upgrades over time; agent-action approval rate; retention/cancel-reason analysis.
- **Outcome:** self-reported stress reduction; conflicts caught pre-emptively; time saved.

---

## 15. Key risks & open questions
- **Trust vs. autonomy pace** — too aggressive feels creepy; too timid feels like every other app. The autonomy ladder must be tuned carefully.
- **AI reliability** — wrong calendar/booking actions erode trust fast; need confidence thresholds, easy undo, and human-in-the-loop for irreversible/financial actions.
- **Integration breadth** — value depends on connecting calendars, email, school/sports portals, grocery/commerce; portal access is fragmented.
- **Privacy posture as moat** — strict kids'-data stance is both an ethical requirement and a differentiator; must not be compromised for growth.
- **Open product questions for review:** geographic launch market? lead with co-parenting or with the dual-income nuclear family? how much commerce in v1?

---

## 16. Acceptance criteria

These define "built to standard," and they are **complete** — covering every feature pillar
(§6.1–6.11), every agentic tier, onboarding, and the platform as a whole. Four kinds:
**§16.1 global quality bars** every feature must clear (the universal Definition of Done),
**§16.2 per-capability criteria** written as verifiable user outcomes, **§16.3 phase launch
gates** (human-validated outcomes), and **§16.4 cross-cutting/platform criteria**. Each is
testable and pass/fail, and tracked one-to-one in
[`delivery/acceptance-ledger.md`](../delivery/acceptance-ledger.md).

### 16.1 Global Definition of Done (applies to every feature)
A feature is not "done" until **all** of the following hold:
- **AC-G1 — Real-data validation:** verified with at least 5 real (or realistic) family datasets, not a happy-path demo, including a messy/edge case (blended family, missing data, conflicting inputs).
- **AC-G2 — Whole-family, not single-user:** any non-primary member can receive, see, and act on the feature's output **without setting anything up** and **without an in-app account if they choose** (push or SMS/iMessage/WhatsApp fallback). No feature may assume "everyone logged in."
- **AC-G3 — Capture cost ≤ 1 gesture:** any data the feature needs can be captured by photo, forward, paste, or voice — never a multi-field form. If a form is the only path, the feature fails.
- **AC-G4 — Proactive, not parked:** the feature surfaces the right thing *before the user asks* in ≥ 70% of relevant cases in testing, rather than waiting to be opened.
- **AC-G5 — Reversible & logged:** every action the app takes on the family's behalf appears in the activity log, is explained in plain language, and is undoable within its autonomy window. No irreversible or financial action without explicit per-instance approval.
- **AC-G6 — Calm:** the feature adds **zero net notifications** by default — anything non-urgent rolls into the Daily Brief. Net notification count per family must not rise when the feature ships.
- **AC-G7 — Accessible & fast:** meets WCAG AA, works one-handed, glanceable from a widget/lock screen; primary surface interactive in < 2s on a mid-range phone.
- **AC-G8 — Privacy by default:** no children's data collected beyond what the feature needs; nothing used for model training; access scoped by role; passes a privacy review before launch.
- **AC-G9 — Graceful failure:** when the AI is unsure, it asks or defers rather than acting wrongly; every automated extraction/action has a confidence threshold and a human-in-the-loop path.

### 16.2 Per-capability acceptance criteria (Given / When / Then)

**Family Brain & Capture (§6.1)**
- Given a photo of a school flyer, when captured, then the correct event (title, date, time, location, child) is extracted and filed with ≥ 90% field accuracy, in < 10s, needing at most one correction tap.
- Given a duplicate provider entered two ways ("Dr. Lee" / "Lee Family Dental"), when both appear, then the Brain merges them or flags the ambiguity — it never silently creates a conflicting duplicate.

**Calendar & Conflict radar (§6.2)**
- Given two overlapping events requiring the same driver/car, when both exist on the calendar, then the conflict is detected and explained in plain language **before** the day arrives, and ≥ 1 concrete resolution (who drives, carpool draft, reschedule message) is offered in one tap.
- Given two-way sync with Google/Apple/Outlook, when an event changes in either system, then it reconciles within 60s with no duplicates.

**Fair-Share load-balancing (§6.3 — signature)**
- Given a household's task history, when viewed, then the app produces a load breakdown that **includes anticipatory/cognitive work** (not just completed chores) and the primary user agrees it "feels accurate" in ≥ 80% of user tests.
- Given a measured imbalance, when a new task is generated, then it is routed to the under-loaded member with everything needed to act in-context, and over a 4-week test the share of tasks completed by non-primary members measurably increases.

**Meals → grocery closed loop (§6.4)**
- Given dietary needs, the week's schedule, budget, and pantry state, when a meal plan is generated, then every meal respects all hard constraints (allergies = 100%, never violated) and fits the night's time window.
- Given an approved plan, when confirmed, then a correct cart is built and an order placed; when Thursday's plan changes, then the order/list updates accordingly.

**Communication & drafts (§6.5)**
- Given a noisy group thread, when summarized, then the summary contains every item requiring the user's action and no fabricated ones (zero hallucinated commitments).
- Given a drafted message sent on the user's behalf, then it is always shown for approval before sending unless the user set that category to full-auto.

**Inbox / document triage (§6.6)**
- Given a connected inbox/portal, when newsletters and notices arrive, then ≥ 90% of true action items become dated, assigned tasks and ≤ 1 in 20 non-actionable items is wrongly escalated.
- Given a signed-permission-slip task, then it is tracked until completion and the document is retrievable at the moment of need (e.g., searchable in < 5s).

**Agentic layer & autonomy (§7)**
- Given a natural-language goal ("sort out Leo's party"), when issued, then the co-pilot returns an approvable, editable plan covering date, logistics, invites, tasks, and provisioning — not just a chat reply.
- Given the autonomy ladder, when a family sets a category's level, then the app's behavior matches exactly (Notify never acts; Full-auto never interrupts), and the choice is visible and revocable at any time.
- Given any agent action, then it is reflected in the "everything I did for you" log within seconds, with reason and undo.

**Daily Brief (§7.3)**
- Given a family's day, when the morning Brief is delivered, then it includes today's logistics, caught conflicts, the ≤ 3 decisions needing one tap each, and what was already handled — readable in < 60s. Target: Brief is opened on ≥ 60% of active days (core retention loop).

**Trust, privacy & safety (§10)**
- Given an under-13 profile, then data collection is minimized, parental consent is verifiable, retention is disclosed, and the data is provably excluded from any model training.
- Given a teen with privacy settings, then those boundaries are honored across location, chat, and visibility, and cannot be overridden silently.
- Given any cross-member access (grandparent, co-parent, sibling caregiver), then they see only what their role scopes allow, verified by an access-control test suite.

**Brain self-maintenance (§6.1③)**
- Given a known fact that changes in the world (swim moves from Tuesdays to Thursdays), when the app sees the new signal, then it updates the Brain, records the change with its source, and flags only genuinely ambiguous changes for confirmation — it never silently overwrites a fact without a trace.

**Calendar auto-resolve & coordinate (§6.2③)**
- Given a detected conflict and a chosen resolution (carpool ask / reschedule message / backup sitter), when the user approves it, then the app executes that action (sends the draft, books the sitter at the set autonomy level), updates the calendar, and logs it with an undo — no irreversible coordination happens without approval.

**Auto-task generation (§6.3②)**
- Given an obligation implied by the Brain (an RSVP date, a gift need, a passport expiring before a booked trip), when detected, then the app creates a dated, assigned task with enough lead time to act, attaches what's needed to do it, and never duplicates a task the family already has.

**Meals — staples reordering (§6.4③)**
- Given tracked household staples and their depletion rate, when an item is about to run out, then the app reorders it at the category's autonomy level (silently only on full-auto), within the family budget cap, and every reorder appears in the activity log.

**Co-parent neutral comms (§6.5③)**
- Given a tense or charged message, when the user asks the app to send it, then the app offers a neutral, factual rephrase that preserves the meaning, records it in the shared co-parent log, and never sends without approval unless that category is set to full-auto.

**Autonomous filing & follow-through (§6.6③)**
- Given an incoming document (medical record, permission slip, warranty), when received, then the app files it to the correct member/category, tracks any open obligation until it's complete, and retrieves the right document on request in < 5s at the moment of need.

**Kids, school & activities (§6.7)**
- Given each child's timeline, when a time-sensitive window approaches (well-visit, a registration that sells out, a sign-up deadline), then the app surfaces it with enough lead time to act, assigned to a responsible adult.
- Given a request for an activity, when the app proposes options, then each fits the child's age, the family calendar, and the budget; it drafts the registration and only books a paid activity with explicit per-instance approval.

**Health & wellbeing (§6.8)**
- Given the whole-family health view (appointments, meds, refills), when a refill is near depletion or a routine visit is due, then the app proactively prompts "time to book/refill" before the gap, scoped to the right member by role.
- Given approval to book, when the app schedules an appointment, then it fits the family calendar, arranges a ride if needed, and assembles a visit pack (history, questions, insurance doc) — booking/financial steps are gated, never automatic.

**Money & household admin (§6.9)**
- Given the family's recurring spend, when reviewed, then the app flags renewals/price-creep/unused subscriptions and produces a fair co-parent expense split with an auditable ledger both sides can see.
- Given a bill or reimbursement, when the user approves, then the app pays it / files the claim / settles the co-parent balance — no payment or irreversible financial action ever happens without explicit per-instance approval.

**Eldercare & extended family (§6.10)**
- Given care tasks shared across siblings, when one is done (meds given, appointment owned), then the shared care log reflects it so nothing is dropped or duplicated.
- Given a care need, when distributed, then the app assigns it across the sibling group with what's needed, arranges transport to appointments on approval, and keeps an auditable care record.

**Travel, logistics & memories (§6.11)**
- Given an itinerary, weather, and each member, when a trip is planned, then the app generates a packing list and holds confirmations/passports retrievable at the moment of need.
- Given a trip goal within budget and calendar, when the app plans it, then it returns an approvable end-to-end plan (transport, lodging, rides), and afterward compiles a shared memory album.

**Onboarding & zero-setup (§8)**
- Given a brand-new primary user, when they capture their first item (snap one flyer), then they see real value within the first session — a correctly filed event — without ever facing an empty calendar to fill; "aha" is reached in < 2 minutes.
- Given a non-primary member added by phone number or email, when the family assigns them their first item, then they receive and can act on it through their existing channel (push or SMS/iMessage/WhatsApp) without creating an account or doing any setup.

### 16.3 Phase launch gates
No phase ships until its headline outcome is demonstrated on real families:
- **Phase 0 (Wedge):** ≥ 80% of test families say capture + conflict radar + Brief caught something they'd otherwise have missed, within the first week.
- **Phase 1 (Load):** measurable rise in non-primary-member task completion **and** primary user reports reduced mental load (validated survey).
- **Phase 2 (Provision & act):** families let the app complete a closed-loop action (order/booking) end-to-end and rate the result trustworthy.
- **Phase 3 (Whole family):** ≥ 1.5 active members per household sustained over 4 weeks (anti single-user-gravity proven).
- **Every phase:** north-star metric (proactive actions accepted per family) trends up, and agent-action approval rate stays above an agreed trust threshold.

### 16.4 Cross-cutting / platform criteria (apply to the app as a whole)
- **AC-X1 — Offline-first capture:** capture works with no connection; queued items sync on reconnect with no loss and no duplication.
- **AC-X2 — Idempotent, recoverable actions:** an agent action retried after a failure/crash never double-executes (no double-booking, double-order, double-send); no data is lost on crash.
- **AC-X3 — Internationalization:** dates, times, numbers, and currencies localize correctly; the app is usable in at least one right-to-left locale with no clipping or mirrored-layout breakage.
- **AC-X4 — Security:** data is encrypted in transit and at rest; the role-based access-control suite passes; secret-scanning and a pre-launch security review are clean.
- **AC-X5 — Performance at scale:** a large household (many members, a year of calendar/tasks/documents) stays within the §16.1 performance budget; no operation blocks the UI.
- **AC-X6 — Auditability:** every agent action is fully reconstructable from the activity log — who/what/why/when, with its undo — and the log cannot be silently edited.
