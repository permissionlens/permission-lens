import metamaskAllowedMethodsEnforcer from "../data/metamask-allowed-methods-enforcer-v1.3.0.json";
import metamaskAllowedTargetsEnforcer from "../data/metamask-allowed-targets-enforcer-v1.3.0.json";
import metamaskDelegationManager from "../data/metamask-delegation-manager-v1.3.0.json";
import metamaskErc20TransferAmountEnforcer from "../data/metamask-erc20-transfer-amount-enforcer-v1.3.0.json";
import metamaskLimitedCallsEnforcer from "../data/metamask-limited-calls-enforcer-v1.3.0.json";
import metamaskLogicalOrWrapperEnforcer from "../data/metamask-logical-or-wrapper-enforcer-v1.3.0.json";
import metamaskNativeTokenTransferAmountEnforcer from "../data/metamask-native-token-transfer-amount-enforcer-v1.3.0.json";
import metamaskRedeemerEnforcer from "../data/metamask-redeemer-enforcer-v1.3.0.json";
import metamaskTimestampEnforcer from "../data/metamask-timestamp-enforcer-v1.3.0.json";
import metamaskValueLteEnforcer from "../data/metamask-value-lte-enforcer-v1.3.0.json";
import ambireAccount7702 from "../data/ambire-account7702.json";
import ethInfinitismSimple7702Account from "../data/eth-infinitism-simple7702account-v0.8.0.json";
import ethInfinitismSimple7702AccountInitialDeployment from "../data/eth-infinitism-simple7702account-v0.8.0-initial-deployment.json";
import metamaskEip7702StatelessDelegator from "../data/metamask-eip7702-stateless-delegator-v1.3.0.json";
import type { RawEntry } from "./index.js";

/**
 * Every real (non-`example-*`) entry in `data/`, statically imported so
 * bundlers (Next.js, tsup, a Snap build) can inline them without a
 * filesystem read — `loadRegistryFromPackage()` in the CLI does that read
 * instead, since Node is fine there. Keep this list in sync with `data/`;
 * `packages/registry/test` catches a drift between the two.
 */
export const defaultEntries: RawEntry[] = [
  ambireAccount7702,
  ethInfinitismSimple7702Account,
  ethInfinitismSimple7702AccountInitialDeployment,
  metamaskAllowedMethodsEnforcer,
  metamaskAllowedTargetsEnforcer,
  metamaskDelegationManager,
  metamaskEip7702StatelessDelegator,
  metamaskErc20TransferAmountEnforcer,
  metamaskLimitedCallsEnforcer,
  metamaskLogicalOrWrapperEnforcer,
  metamaskNativeTokenTransferAmountEnforcer,
  metamaskRedeemerEnforcer,
  metamaskTimestampEnforcer,
  metamaskValueLteEnforcer,
] as RawEntry[];
