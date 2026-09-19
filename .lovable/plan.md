# Fix, finish and secure Starpace

Four workstreams, in this order: safety (payments first), things that don't save, unfinished features, then look and mobile.

## 1. Withdrawals without stored account details

Today the app asks creators for bank/crypto details, sends them to the payment provider and keeps a copy. That goes away.

- Remove the "add withdrawal account" form and all saving of bank, crypto or provider account details.
- A withdrawal becomes a simple request: creator enters an amount (within their available balance, above the minimum), confirms, and the request is recorded as *pending review*.
- You review and pay out requests from the admin console: approve (mark paid, with an optional note) or decline (with a reason). The creator sees the status update in their earnings screen.
- Any account details already stored are wiped, and the app stops reading those fields.
- Paid subscriptions and tips stay exactly as they are — money in still goes through the provider's own secure checkout, so card details never touch this app.

## 2. Everything saves, for every account

Audit each settings and account surface and make it read and write real rows, per account, surviving refresh and a second device:

- Notification, privacy, accessibility and theme preferences
- Feed tuning choices
- Monetization switches (tips on/off, minimum tip, subscriptions)
- Support tickets and their replies
- Developer API keys and webhooks
- Team workspace, members and invitations
- Custom branding

Each one gets: loading state, a saved confirmation, an error message that says what to retry, and no leftover browser-only copies that leak one account's data to another on the same device.

## 3. Finish the unfinished

- Stories: 24-hour expiry honoured everywhere, views and likes recorded, creator sees who viewed.
- Live rooms: join/leave, speaker requests, raise hand, muting, live listener counts, host ending a room.
- Messages: unread counts that clear correctly, read receipts, reactions, media messages, pagination for long threads.
- Calls: start, ring, answer, decline, end, and a call history entry with duration.
- Notifications: created for every real event (follow, like, comment, mention, tip, invitation, ticket reply) and marked read properly.
- Follows, likes, reposts, bookmarks and poll votes: counts always match reality.
- Moderation: reports queue with working actions, warnings, suspensions, and an audit entry for each.
- Guard every action that needs an account with a clear "sign in to continue" prompt instead of a silent failure.

## 4. Safety pass

- Confirm nobody can read another person's messages, tickets, keys, earnings or team data.
- Admin and moderator powers only via real assigned roles, checked on the server.
- Every write validated on the server, not just in the form.
- No secret keys, provider tokens or internal ids exposed to the browser.

## 5. Look, speed and mobile

- One consistent visual language across all screens under the Starpace brand; consistent buttons, cards, spacing and dark mode.
- Every screen gets real loading, empty and error states, plus a toast for each action.
- Split the heaviest screens, load long lists in pages, lazy-load images and heavy dialogs.
- Mobile pass on every screen: safe areas, tap targets, keyboard behaviour, bottom navigation, no sideways scrolling.

## 6. Verification

Walk the whole app in a real browser as a brand-new account, on phone and desktop: sign up, post, follow, message, call, join a room, tip, upgrade, request a withdrawal, then review that withdrawal as admin.

## Technical notes

- Payouts: drop the destination flow from `payouts.functions.ts`; `requestPayout` validates the balance and inserts a `payouts` row with status `pending` and no destination/recipient code. New admin server functions `approvePayout` / `declinePayout` (role-checked, audit-logged) move it to `paid` / `failed`. Stop reading and writing `monetization_settings.bank_details / crypto_details / paystack_details`; blank those values. Provider transfer calls and `listPayoutBanks` / `savePayoutDestination` are removed.
- Local-first stores converted to DB-backed with optimistic writes and per-user hydration; no `localStorage` as source of truth.
- All mutations as `createServerFn` with `requireSupabaseAuth` and zod validation; admin ones additionally `has_role` + `audit_logs`.
- Code-split `routes/index.tsx`, `routes/messages.tsx`, admin and analytics; paginate feed and message queries.
