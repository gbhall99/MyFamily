import { describe, it, expect, vi } from "vitest";
import { CaptureQueue } from "../src/offline.js";
import { IdempotencyGuard } from "../src/idempotency.js";

describe("Offline capture queue (AC-X1)", () => {
  it("queues offline, de-duplicates by id, and syncs with no loss or duplication", () => {
    const q = new CaptureQueue();
    q.enqueue({ id: "a", text: "Leo swim Thu 5pm", createdAt: 1 });
    q.enqueue({ id: "b", text: "Permission slip due Fri", createdAt: 2 });
    q.enqueue({ id: "a", text: "duplicate of a", createdAt: 3 }); // same id → ignored
    expect(q.size()).toBe(2);
    expect(q.pending()).toHaveLength(2);

    const sent: string[] = [];
    expect(q.sync((c) => sent.push(c.id))).toBe(2); // both sent, in order
    expect(sent).toEqual(["a", "b"]);
    expect(q.pending()).toHaveLength(0);

    // re-sync (e.g. a retry) sends nothing — no double delivery
    expect(q.sync((c) => sent.push(c.id))).toBe(0);
    expect(sent).toEqual(["a", "b"]);
  });
});

describe("Idempotent actions (AC-X2)", () => {
  it("runs an action once per key; a retry returns the cached result, never re-executes", () => {
    const guard = new IdempotencyGuard<string>();
    const action = vi.fn(() => "order-123");

    const first = guard.run("place-order:thu", action);
    const retry = guard.run("place-order:thu", action); // same key (a retry)

    expect(first).toBe("order-123");
    expect(retry).toBe("order-123");
    expect(action).toHaveBeenCalledTimes(1); // no double-execute
  });

  it("treats distinct keys as distinct actions", () => {
    const guard = new IdempotencyGuard<number>();
    const a = vi.fn(() => 1);
    const b = vi.fn(() => 2);
    expect(guard.run("k1", a)).toBe(1);
    expect(guard.run("k2", b)).toBe(2);
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });
});
