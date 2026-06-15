/**
 * Idempotent action execution (SPEC §16.4 / AC-X2). An agent action keyed by an
 * idempotency key runs at most once; a retry after a failure/crash returns the
 * recorded result rather than executing again — so no double-booking, double-order,
 * or double-send.
 */
export class IdempotencyGuard<T> {
  private results = new Map<string, T>();

  /** Run `action` only if `key` hasn't run before; otherwise return the cached result. */
  run(key: string, action: () => T): T {
    const existing = this.results.get(key);
    if (existing !== undefined || this.results.has(key)) return existing as T;
    const result = action();
    this.results.set(key, result);
    return result;
  }

  has(key: string): boolean {
    return this.results.has(key);
  }
}
