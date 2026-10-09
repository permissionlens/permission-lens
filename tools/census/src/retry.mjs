/**
 * Retries `fn` with exponential backoff. RPC providers rate-limit (HTTP 429)
 * long scans routinely; a block or code lookup that fails after every attempt
 * must surface as an error, because silently dropping it would leave a gap in
 * the census data (or, for code lookups, misfile a real delegate as "no code").
 *
 * @template T
 * @param {() => Promise<T>} fn
 * @param {{ attempts?: number, baseDelayMs?: number }} [opts]
 * @returns {Promise<T>}
 */
export async function withRetry(fn, { attempts = 6, baseDelayMs = 500 } = {}) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, baseDelayMs * 2 ** attempt));
      }
    }
  }
  throw lastError;
}
