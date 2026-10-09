import { describe, expect, it } from "vitest";
import type { PublicClient } from "viem";
import { withRetry } from "../src/retry.mjs";
import { scanBlockRange } from "../src/scan.mjs";
import { fetchBytecodeForAddresses } from "../src/fetch-bytecode.mjs";

const emptyBlock = (n: bigint) => ({ number: n, transactions: [] });

describe("rate-limit handling", () => {
  it("withRetry retries until the call succeeds", async () => {
    let calls = 0;
    const result = await withRetry(
      async () => {
        if (++calls < 3) throw new Error("429");
        return "ok";
      },
      { baseDelayMs: 1 },
    );
    expect(result).toBe("ok");
    expect(calls).toBe(3);
  });

  it("scanBlockRange recovers from transient failures without gaps", async () => {
    const seen = new Set<bigint>();
    const client = {
      getBlock: async ({ blockNumber }: { blockNumber: bigint }) => {
        if (!seen.has(blockNumber) && blockNumber === 2n) {
          seen.add(blockNumber);
          throw new Error("429");
        }
        return emptyBlock(blockNumber);
      },
    } as unknown as PublicClient;
    await expect(scanBlockRange({ client, fromBlock: 1n, toBlock: 4n, retryDelayMs: 1 })).resolves.toEqual([]);
  });

  it("scanBlockRange throws, naming the blocks, if any block never succeeds", async () => {
    const client = {
      getBlock: async ({ blockNumber }: { blockNumber: bigint }) => {
        if (blockNumber === 3n) throw new Error("429");
        return emptyBlock(blockNumber);
      },
    } as unknown as PublicClient;
    await expect(scanBlockRange({ client, fromBlock: 1n, toBlock: 4n, retryDelayMs: 1 })).rejects.toThrow(/gaps: 3/);
  });

  it("fetchBytecodeForAddresses throws instead of reporting a failed lookup as no code", async () => {
    const client = { getCode: async () => { throw new Error("429"); } } as unknown as PublicClient;
    await expect(fetchBytecodeForAddresses({ client, addresses: ["0x" + "11".repeat(20)] })).rejects.toThrow();
  }, 60_000);
});
