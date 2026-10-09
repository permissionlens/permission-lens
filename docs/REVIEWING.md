# Reviewing registry entries

The registry only means something if a second person actually checked it.
[`GOVERNANCE.md`](../GOVERNANCE.md) requires two approvals for `recognized`
entries. This is the checklist for the second approval. It takes roughly 5
minutes per entry once you've done one. You don't need to read the Solidity;
you're checking that the evidence is real and matches the entry.

## Before you start

- You have not authored the entry you're approving.
- You have no affiliation with the vendor of the entry (if you do, say so in the PR; it's fine to review, but it has to be visible).
- Entries live in [`packages/registry/data/`](../packages/registry/data/), one JSON file each. Entries still waiting for review contain `NEEDS HUMAN REVIEW` in `review.reviewers`.

## Per entry

1. **Open the evidence links.** Every URL in `evidence` should load. For
   `vendor-docs` and `source`, the page is controlled by the vendor (their
   GitHub org or docs site) and lists the **exact address** in the entry.
   Third-party pages (Etherscan labels, aggregator lists, blog posts) don't count as
   vendor evidence.
2. **Address and chain.** For each item in `match.deployments`, the vendor
   source gives the same address for that chain. Compare all 40 hex
   characters, not just the first and last few. Casing doesn't matter.
3. **Code exists.** On a block explorer for that chain, the address has
   contract code. (Delegate implementations are plain contracts; a 7702
   delegation indicator `0xef0100…` means you opened an account that
   *delegates to* something, not the implementation.)
4. **Codehash** (entries with `match.codehash`). Confirm it equals the
   keccak256 of the runtime code at the address on chain. Either:
   - `cast keccak $(cast code <address> --rpc-url <rpc>)`, or
   - `pnpm --filter @permissionlens/registry verify-codehashes`, which does this for all
     `recognized`/`caution` entries (the nightly CI check runs the same script).
   Entries without a `codehash` match on address only. For those, just confirm
   code exists on every listed chain.
5. **Name and version.** `name`, `vendor` and `version` match what the vendor
   calls the contract and release. A version we guessed is worse than no
   version; flag it.
6. **Status fits.** `recognized` means *the vendor's own deployment*, nothing
   about whether it's safe. If the vendor docs list the address as theirs, it
   qualifies. A copy of their code at a different address does not.
7. **Properties** (if present): `upgradeable`, `initialization`, `storage`,
   `acceptsTypedDataExecution`. Only approve claims you can see in the source or
   an audit. If you can't verify one, ask for it to be removed; a missing
   property is treated as unknown.

## Entries that need a closer look

- **Ambire** (`ambire-account7702.json`): the address is in Ambire's own repo,
  but the repo's *current* compiled bytecode doesn't match what's on chain.
  The codehash in the entry is from chain. Decide whether that's acceptable
  and say so in your review.
- **EF `Simple7702Account` initial deployment**
  (`eth-infinitism-simple7702account-v0.8.0-initial-deployment.json`): an
  early deployment later replaced by the address in the other EF entry,
  kept because it carried real traffic. You may recommend dropping it.
- **MetaMask 7702 delegate** (`metamask-eip7702-stateless-delegator-v1.3.0.json`):
  check it against `documents/Deployments.md` in `MetaMask/delegation-framework`.

## Recording your approval

1. Open a PR that edits only the `review` block of the entries you checked:
   replace `"NEEDS HUMAN REVIEW — see GOVERNANCE.md; …"` with your GitHub handle
   and set `date` to the day you checked.
2. List in the PR description, per entry, what you verified (steps 1 to 7) and
   anything you couldn't. "Checked the evidence" alone isn't a review.
3. `pnpm --filter @permissionlens/registry validate` must pass (CI runs it).
4. A maintainer merges. Don't self-merge your own approval.

## If something doesn't check out

Don't approve it. Open an issue naming the entry and what didn't match (wrong
address, dead link, codehash mismatch). Entries stay at their current status
until it's resolved. See "Disputes" in [`GOVERNANCE.md`](../GOVERNANCE.md).

## Reviewing a `malicious` entry

A higher bar: you need the transaction hashes (`onchain` evidence) and you
should open at least two of them and see the funds being taken. A big
cluster or an unfamiliar contract alone is not evidence. Exchanges, wallet
providers and bundlers legitimately move many accounts' funds in the same
pattern. Say what you saw in each transaction, not just that you looked.
