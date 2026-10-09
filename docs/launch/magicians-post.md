# Ethereum Magicians post (draft)

Not posted. Category: **Wallets** (move to **ERCs** only if the discussion turns
into a spec proposal). Everything below the `---` is the post, ready to
paste (Markdown). Read it end to end and post it yourself. If the census
numbers change before you post, update the "What I found" section.

---

## Title

PermissionLens: an open IR, rule set and registry for "what does this signature grant?" (7702 / 7710 / 7715)

## Body

**The problem.** Wallets simulate transactions to show what will happen. An
EIP-7702 authorization, an ERC-7710 delegation or an ERC-7715 permission
request doesn't *do* anything when signed. No balance moves, so a simulator
has nothing to show. The damage comes later, when the delegate contract or
session key is used. Users sign scope, not a transaction, and almost nothing
decodes that scope into plain language before they sign.

**What I built.** PermissionLens is an offline library plus data:

- One intermediate representation, `Grant`, for all three standards: grantor,
  grantee (code / account / anyone / unknown), chains, scope (full-account /
  revoke / restricted / unknown), validity window, replay protection,
  revocation method, and the redelegation chain for 7710. Restrictions are a
  typed union (targets, methods, value caps, periodic and stream limits, call
  counts, time, redeemers). A caveat enforcer without a decoder is kept as
  `opaque`/`unrecognized` and never silently dropped.
- A rule set that runs over the IR and emits findings with a severity, a
  confidence (`certain` or `heuristic`) and plain-language text. There are
  29 documented rules, for example "valid on every chain" (PL-7702-001),
  "bearer delegation" (PL-7710-002), "no caveats" (PL-7710-001) and "granted
  delegation is wider than requested" (PL-7715-003). Each has a page under
  [`docs/rules/`](https://github.com/permissionlens/permission-lens/tree/main/docs/rules)
  that says what it checks, why it matters, and what to do.
- A CC0 registry of recognized / caution / malicious delegates and
  enforcers, keyed by normalized codehash, with a written
  [governance and evidence bar](https://github.com/permissionlens/permission-lens/blob/main/GOVERNANCE.md).
  14 entries today: MetaMask's Delegation Framework v1.3.0 (manager,
  enforcers, and its 7702 delegate), Ambire's 7702 account, and the Ethereum
  Foundation's `Simple7702Account`. Each cites the vendor's own repo for the
  address.
- Packages: `@permissionlens/core` (offline, no network), `registry`,
  `onchain` (optional enrichment through a viem client), `cli`, and a
  MetaMask Snap.

**Demo.** https://permission-lens-web.vercel.app — paste a request and see the decoded grant and findings. Decoding runs in the browser; nothing you paste is sent anywhere.

**What I found.** As a first test of the pipeline I scanned the first 1,001
blocks after Pectra activated (22431084 onward, about 3.5 hours) for type-4
transactions: 294 authorizations across 15 distinct delegate contracts. I've
reviewed the top three, which cover 87% of them, and all three are ordinary
infrastructure (the other twelve are small and not yet reviewed):

- 235 (80%) went to one delegate that Etherscan labels as WhiteBIT's. The
  sample I read was the exchange moving a customer's deposit into its own
  wallet. That looks like a sweeper by shape, but the sweeping party is the
  exchange itself.
- 13 went to Ambire's 7702 account, and 9 to the Ethereum Foundation's
  `Simple7702Account`, sent through ERC-4337 bundlers.

So early 7702 traffic here was mostly an exchange and account-abstraction
wallets, and "unrecognized" mostly meant "not in the registry yet". It's also a warning
for the rules: a sweeper heuristic that flags an exchange's deposit flow
isn't telling the user much. This is a few hours of data, not a trend, and a
wider scan is next.

**Honest limits.**
- The rules say "unrecognized", not "unsafe". A missing registry entry is a
  prompt to look closer, not a verdict.
- The Snap can show signature insight for 7710 typed-data. The Snaps SDK
  doesn't expose `authorizationList`, so there is no transaction insight for
  7702 yet. 7715 requests don't reach insight handlers either. Both are
  documented in the Snap README.
- Two rules are not implemented yet: Sourcify verification and a cross-chain
  code diff.
- The registry has had one automated pass, and I'm lining up a second
  reviewer before calling any entry final.

**What I'd like feedback on.**
1. Is the `Grant` IR the right shape? In particular, should 7715's
   "request" and the resulting 7710 "delegation" be linked parent/child
   grants, as I did, or kept as separate objects?
2. Which rules would you cut or add? Which severities seem wrong?
3. For wallet and tooling authors: would you consume this as a library, as
   the registry data only, or not at all? What would block you?
4. Is there existing work (including ERC-7730 descriptors) I should be
   building on rather than duplicating?

Repo: https://github.com/permissionlens/permission-lens (MIT/Apache-2.0
code, CC0 registry data). Issues and PRs welcome, especially from teams that
ship delegate implementations and want them in the registry.
