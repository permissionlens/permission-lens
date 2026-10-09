# Phase 0 outreach messages (draft)

Not sent. Read each one, check the channel is current (contact pages and
Discords move), and send them yourself. Nothing is on npm yet, so every message
links the repo and the live demo and asks for an evaluation, not an
integration. Swap in the Magicians thread link once that post is up.

Links used below:
- Repo: https://github.com/permissionlens/permission-lens
- Demo: https://permission-lens-web.vercel.app
- Rules: https://permission-lens-web.vercel.app/rules

---

## Clear Signing working group (clearsigning.org)

Find their current contact route (contact page, Discord or the ERC-7730
repo's discussions) first. **Subject / first line:** Does grant-scope decoding
for 7702/7710/7715 fit alongside ERC-7730?

> Hi, I'm working on PermissionLens, an open-source decoder for what an
> EIP-7702 authorization, ERC-7710 delegation or ERC-7715 permission request
> actually grants. These don't move funds when signed, so simulation shows
> nothing, and ERC-7730 descriptors cover contract calls and typed data
> fields rather than the scope of an authority grant.
>
> It has one IR (`Grant`) for all three, 29 documented risk rules, and a CC0
> registry of recognized/caution/malicious delegates keyed by codehash.
> Repo: https://github.com/permissionlens/permission-lens, demo:
> https://permission-lens-web.vercel.app
>
> Two questions: (1) is this in scope for the working group, or is it
> something you'd rather see as a separate effort? (2) If it fits, would
> descriptors for grants be better expressed as an ERC-7730 extension, or
> should the two stay separate and cross-reference each other? I'd rather
> build on what exists than duplicate it, and I'm happy to present or share a
> short write-up.

---

## Integrators

Each is meant to be 5-6 lines. Use their preferred channel: a GitHub
issue or discussion if they have one open to outsiders, otherwise
Discord/Telegram/email. Check CONTRIBUTING and community rules first.

### Rabby

> Hi Rabby team. Rabby's preview simulates state changes, but EIP-7702
> authorizations and ERC-7710/7715 grants change nothing when signed, so
> users see nothing about what authority they're handing over.
> PermissionLens is an offline, open-source decoder for those (plain-language
> scope + evidence-backed risk findings): https://github.com/permissionlens/permission-lens
> Demo: https://permission-lens-web.vercel.app
> Would you be open to evaluating it for the signing preview? Even "not a
> fit, because X" would help.

### Ambire

> Hi Ambire team. Ambire is already built on smart accounts, so you've
> probably thought about this: when a user signs an EIP-7702 authorization or
> an ERC-7710/7715 grant, what shows them the scope? PermissionLens decodes
> those offline into a plain summary plus risk findings and has an open
> registry of known delegates: https://github.com/permissionlens/permission-lens
> Demo: https://permission-lens-web.vercel.app
> Would you evaluate it? And does your delegate belong in the registry?

### Frame

> Hi Frame team. Frame's signing screens show simulated effects, but EIP-7702
> authorizations and 7710/7715 grants have no effect to simulate at sign time.
> PermissionLens decodes them offline into an authority summary and risk
> findings (library, no network calls by default):
> https://github.com/permissionlens/permission-lens
> Demo: https://permission-lens-web.vercel.app
> Would you evaluate it for the signing UI?

### Blockscout

> Hi Blockscout team. Your 7702 account view shows an EOA's current delegate
> address. PermissionLens maintains a CC0 registry of recognized, caution and
> malicious delegate implementations (keyed by normalized codehash, with
> evidence): https://github.com/permissionlens/permission-lens
> Demo: https://permission-lens-web.vercel.app
> Would you evaluate showing a "known delegate" badge from that data? I'm
> glad to write the PR if you tell me where it should live.

### Embedded-wallet SDK (pick one: Privy, Dynamic or Web3Auth)

> Hi [team]. Embedded wallets are starting to request EIP-7702 authorizations
> and ERC-7715 permissions on users' behalf, and users have no readable view
> of what they're approving. PermissionLens is an offline, open-source
> decoder that turns those requests into a plain-language scope plus risk
> findings: https://github.com/permissionlens/permission-lens
> Demo: https://permission-lens-web.vercel.app
> Would you evaluate it as a confirmation-screen component or a pre-sign
> check in your SDK?

---

## Before sending

- The registry has had one automated review pass. Don't describe entries as
  "reviewed" until the second maintainer has approved them (Step 3).
- Don't send the Blockscout PR offer unless you're ready to write the PR.
- Track replies in `docs/progress/phase-0-validate-and-setup.md`. The exit
  check is at least 2 parties who want to evaluate it, or the WG confirming
  fit.
