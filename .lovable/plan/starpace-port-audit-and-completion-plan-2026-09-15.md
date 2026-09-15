# Starpace — port, audit and completion plan

## What the repo contains

The GitHub project is a creator social network ("Starpace"): feed, stories, live audio
spaces, direct messages with calls, explore, bookmarks, notifications, profiles, pricing
and plans, an admin console (users, content, moderation, audit logs, system settings),
plus monetization: tips, subscriptions, Paystack payouts, analytics, developer portal and
team workspaces. About 38,000 lines, 155 files, all screens built.

## Audit findings

1. **Wrong runtime.** The export runs as a plain browser app with no server. This project
   uses a server-rendered setup, so the port needs the shell, entry and page metadata
   rewired.
2. **No working backend.** All data code points at a database belonging to a different
   project, and the schema (35 tables) exists here only as type definitions. Nothing
   saves today.
3. **Server-only work runs in the browser.** A stand-in replaces the real server layer, so
   payments, payouts, AI drafting, admin actions and usage quotas execute client-side —
   both insecure and non-functional. Payment webhooks are dead code.
4. **Access rules missing.** No row-level security or roles exist yet, so private data
   (messages, payments, tickets) would be readable by anyone once the database is live.
5. **AI features half-wired.** Two competing AI paths; one references a model name that
   does not exist.
6. **Design/UX gaps.** Placeholder brand naming ("Spaces" vs "Starpace"), no page titles
   per screen, no shared empty/error states, long lists render unvirtualized, images load
   eagerly, and several long screens need mobile layout passes.

## Plan

### 1. Port
- Bring all screens, components and libraries into this project.
- Rebuild app shell, routing entry and per-page titles/descriptions; remove the old
  browser-only entry, and make the home page the Starpace landing page.
- Align dependencies with this stack; remove the unused Gemini/Express packages.

### 2. Backend
- Turn on Lovable Cloud (database, auth, storage, server functions).
- Recreate the full 35-table schema with roles, helper functions, access rules and
  permissions, a media storage bucket, and demo content so every screen has data on first
  load.
- Convert the stand-in server layer to real server functions: AI drafting with quotas,
  admin actions, tips, subscriptions, payouts, Paystack webhook.

### 3. Payments
- Wire Paystack end to end: tip and subscription checkout, verified webhook, payout
  requests, payment history. I'll request your Paystack secret key securely once the
  webhook endpoint exists.

### 4. Features and bug fixes
- Complete anything that only looks finished: story expiry, feed tuning, unread counts,
  live-space participation, call flow, moderation queue actions, audit logging,
  developer API keys, workspace invitations, support tickets.
- Fix broken links, dead buttons, unhandled loading/error states, and duplicate state.

### 5. Design, performance, responsiveness
- One consistent design system (tokens, type scale, dark mode) under the Starpace brand.
- Real empty, loading and error states everywhere; toasts for every action.
- Performance: paginate/virtualize feeds and messages, lazy-load images and heavy modals,
  cache queries, code-split admin and analytics.
- Mobile-first pass on every screen: safe areas, bottom navigation, touch targets,
  keyboard behaviour, tablet and desktop breakpoints.

### 6. Verification
- Build and type checks clean; walk the app in a real browser and check sign-up, posting,
  messaging, spaces, tipping, admin and mobile layouts.

## Technical notes

- TanStack Start (file routes, `createServerFn`), Supabase via Lovable Cloud, Tailwind v4
  tokens in `src/styles.css`.
- Schema derived from `src/integrations/supabase/types.ts`; every table gets GRANTs, RLS
  and policies; roles in a separate `user_roles` table with a `has_role` security-definer
  function.
- AI consolidated onto the Lovable AI Gateway (`google/gemini-2.5-flash`).
- Paystack secret used only inside server functions; webhook at
  `/api/public/paystack/webhook` with signature verification.

## Scope note

This is a large port. I'll work in stages (port → backend → payments → polish) and report
after each so you can review as it lands.
