---
"@permissionlens/core": minor
"@permissionlens/registry": minor
"@permissionlens/onchain": minor
"@permissionlens/cli": minor
---

First release.

- `core`: offline decoding of EIP-7702 authorizations, ERC-7710 delegations and ERC-7715 permission requests into one `Grant` IR, plus 29 documented risk rules with severity and confidence.
- `registry`: CC0 delegate and enforcer data keyed by address and codehash. 14 entries: MetaMask Delegation Framework v1.3.0 (manager, enforcers, 7702 delegate), Ambire's 7702 account, and the Ethereum Foundation's `Simple7702Account`.
- `onchain`: optional enrichment (bytecode, nonce, delegation state) through a viem `PublicClient`.
- `cli`: `permissionlens decode` and `permissionlens address`.

Registry entries are flagged for human review in their `review` block until a second maintainer approves them (see `docs/REVIEWING.md`).
