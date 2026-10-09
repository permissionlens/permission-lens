import { normalizeAuthorization } from "@permissionlens/core";
import { withRetry } from "./retry.mjs";

/**
 * One EIP-7702 authorization tuple observed in a mined type-0x04
 * transaction, flattened out of `tx.authorizationList` (a single tx can
 * carry several).
 *
 * @typedef {object} CensusRecord
 * @property {number} blockNumber
 * @property {string} txHash
 * @property {string | null} sender - the tx sender, which can differ from the authority that signed the tuple (a relayer can submit someone else's authorization).
 * @property {number} chainId
 * @property {string} delegate - lowercased address
 */

/**
 * Scans `[fromBlock, toBlock]` (inclusive) for type-0x04 transactions and
 * flattens every authorization tuple in each one into a {@link CensusRecord}.
 * Each block fetch is retried with backoff (rate limits are expected on long
 * ranges). If any block still fails, the scan throws after finishing the
 * range, listing the failed blocks — a census with silent gaps is worse than
 * no census, so partial results are never returned.
 *
 * @param {{
 *   client: import("viem").PublicClient,
 *   fromBlock: bigint,
 *   toBlock: bigint,
 *   concurrency?: number,
 *   retryDelayMs?: number,
 *   onProgress?: (current: bigint, total: bigint) => void,
 * }} opts
 * @returns {Promise<CensusRecord[]>}
 */
export async function scanBlockRange({ client, fromBlock, toBlock, concurrency = 8, retryDelayMs = 500, onProgress }) {
  if (toBlock < fromBlock) {
    throw new Error(`toBlock (${toBlock}) is before fromBlock (${fromBlock})`);
  }

  const blockNumbers = [];
  for (let n = fromBlock; n <= toBlock; n++) blockNumbers.push(n);

  const total = BigInt(blockNumbers.length);
  let done = 0n;
  const records = [];
  /** @type {bigint[]} */
  const failed = [];

  for (let i = 0; i < blockNumbers.length; i += concurrency) {
    const chunk = blockNumbers.slice(i, i + concurrency);
    const blocks = await Promise.all(
      chunk.map(async (blockNumber) => {
        try {
          return await withRetry(() => client.getBlock({ blockNumber, includeTransactions: true }), { baseDelayMs: retryDelayMs });
        } catch (err) {
          console.error(`census: giving up on block ${blockNumber}: ${/** @type {Error} */ (err).message.split("\n")[0]}`);
          failed.push(blockNumber);
          return null;
        }
      }),
    );

    for (const block of blocks) {
      if (block) records.push(...recordsFromBlock(block));
      done += 1n;
      onProgress?.(done, total);
    }
  }

  if (failed.length > 0) {
    throw new Error(
      `${failed.length} block(s) could not be fetched after retries, so the census would have gaps: ` +
        `${failed.slice(0, 20).join(", ")}${failed.length > 20 ? ", …" : ""}. ` +
        `Lower --concurrency or use a higher-limit RPC, then re-run.`,
    );
  }

  return records;
}

/**
 * @param {import("viem").Block<bigint, true>} block
 * @returns {CensusRecord[]}
 */
function recordsFromBlock(block) {
  const records = [];
  for (const tx of block.transactions) {
    if (typeof tx === "string") continue; // includeTransactions: true always hydrates these; guards the type only.
    if (tx.type !== "eip7702" || !tx.authorizationList || tx.authorizationList.length === 0) continue;

    for (const raw of tx.authorizationList) {
      let normalized;
      try {
        normalized = normalizeAuthorization(raw);
      } catch (err) {
        console.error(`census: skipping malformed authorization in ${tx.hash}: ${/** @type {Error} */ (err).message}`);
        continue;
      }

      records.push({
        blockNumber: Number(block.number),
        txHash: tx.hash,
        sender: tx.from ?? null,
        chainId: Number(normalized.chainId),
        delegate: normalized.address.toLowerCase(),
      });
    }
  }
  return records;
}
