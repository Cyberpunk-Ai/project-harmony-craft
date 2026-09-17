# Starpace — second audit and completion plan

Everything builds cleanly, every page loads, the database is live and analytics and
sign-in now run on real data. This pass closes what is left.

## What the audit found

1. **Built-in sample content still leaks into the app.** Four bundled content files feed
   the home feed, Explore and profiles, so a brand-new account sees invented people and
   posts mixed with real ones. Anything that can't be saved is silently kept local.
2. **Several features only look saved.** Support tickets, developer API keys, team
   workspaces, custom branding and monetization settings write to the browser first and
   the database second (or not at all), so they vanish on another device.
3. **Payments are not connected yet.** Checkout, the verified webhook and payout requests
   are built and waiting on your Paystack key.
4. **Payouts and admin actions need finishing.** Payout approval/failure states, moderation
   queue actions and audit logging aren't wired to real rows end to end.
5. **AI drafting has no usage limits.** Drafting, captions and space summaries run, but the
   daily allowance per plan isn't enforced server-side, so paid limits mean nothing.
6. **Performance.** The home page and messages screen are very large single files loaded up
   front; feeds and message threads render every item; images load eagerly.
7. **Mobile.** Long screens (settings, messages, spaces, admin) still need a pass for safe
   areas, touch targets, keyboard behaviour and bottom navigation.

## Plan

### 1. Real content only
- Remove the bundled sample people and posts from every screen.
- Real empty states everywhere: "no posts yet", "no one to follow yet", "no messages",
  with a clear next action instead of invented filler.
- Make sure a fresh account can post, follow, message and see its own content immediately.

### 2. Make every feature actually save
- Support tickets, developer API keys, workspaces and invitations, branding and
  monetization settings all read and write real rows, with the browser used only as a cache.
- Verify each one survives a refresh and a second device.

### 3. Payments end to end
- Ask for your Paystack key securely, then walk a live upgrade and a live tip: checkout,
  confirmation, plan activation, payment history.
- Finish payouts: request, pending/paid/failed states driven by the payment provider,
  and a clear balance with the minimum threshold.

### 4. Server-side work and safety
- Move admin actions (suspend, warn, hide content, resolve reports) to the server with a
  role check, and log every one to the audit trail.
- Enforce AI daily allowances per plan on the server, with a friendly message when reached.

### 5. Design, performance, responsiveness
- One consistent look under the Starpace brand; toasts for every action; loading and error
  states on every screen.
- Split the heavy screens, load long lists in pages, lazy-load images and heavy dialogs.
- Mobile pass on every screen: safe areas, bottom navigation, tap targets, keyboard.

### 6. Verification
- Walk the whole app in a real browser as a brand-new account: sign up, post, follow,
  message, join a space, tip, upgrade, request a payout, admin — on phone and desktop.

## Technical notes

- Delete `src/lib/seed-*.ts` and the fallbacks in `api-client.ts` / `profile-service.ts`
  that serve them; keep the UUID guard for safety.
- Convert the local-first stores (`support-state`, `developer-state`, `workspace-state`,
  `branding-state`, `monetization-state`) to database-backed reads with optimistic writes.
- Admin mutations become `createServerFn` with `requireSupabaseAuth` plus a `has_role`
  check; each writes an `audit_logs` row.
- AI quota enforced against `subscriptions.ai_drafts_used` / `ai_usage_date`.
- Paystack secret stays server-side only; webhook already verifies signatures.
- Code-split `routes/index.tsx`, `routes/messages.tsx`, admin and analytics; paginate
  feed/messages queries.

## Note

Payments can't be finished without your Paystack secret key — I'll request it securely
when I reach that step.
