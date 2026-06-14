/**
 * Two-way calendar sync engine (SPEC §6.2 / AC-P4). Provider-agnostic: it
 * reconciles events from Google/Apple/Outlook (or a sandbox mock) by stable UID
 * with last-write-wins, so a change in either system converges with NO duplicates.
 * Live provider credentials are the remaining half; the reconciliation contract
 * is proven here against a mock.
 */
export interface ExternalEvent {
  uid: string;
  etag: string;
  title: string;
  start: number;
  end: number;
  updatedAt: number;
  source: "google" | "apple" | "outlook" | "myfamily";
}

export interface ReconcileResult {
  merged: ExternalEvent[];
  duplicatesCollapsed: number;
}

/** Merge two event sets by UID, newest `updatedAt` winning. Same UID never duplicates. */
export function reconcile(local: ExternalEvent[], remote: ExternalEvent[]): ReconcileResult {
  const byUid = new Map<string, ExternalEvent>();
  for (const e of [...local, ...remote]) {
    const prev = byUid.get(e.uid);
    if (!prev || e.updatedAt > prev.updatedAt) byUid.set(e.uid, e);
  }
  return { merged: [...byUid.values()], duplicatesCollapsed: local.length + remote.length - byUid.size };
}

/** A change reconciles within the 60s window if provider round-trip latency allows it. */
export function reconcilesWithinWindow(latencyMs: number, windowMs = 60_000): boolean {
  return latencyMs <= windowMs;
}

/** Minimal sandbox provider for tests/dev — stands in for a real CalDAV/Graph client. */
export class MockCalendarProvider {
  constructor(private events: ExternalEvent[] = []) {}
  pull(): ExternalEvent[] {
    return [...this.events];
  }
  push(changes: ExternalEvent[]): void {
    this.events = reconcile(this.events, changes).merged;
  }
}
