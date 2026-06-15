/**
 * Offline-first capture queue (SPEC §16.4 / AC-X1). Captures made with no
 * connection are queued locally, de-duplicated by id, and synced on reconnect
 * with no loss and no duplication. Sync is safe to retry.
 */
export interface QueuedCapture {
  id: string;
  text: string;
  createdAt: number;
  synced: boolean;
}

export class CaptureQueue {
  private items = new Map<string, QueuedCapture>();

  /** Enqueue a capture. A repeated id is ignored — never duplicated. */
  enqueue(c: { id: string; text: string; createdAt?: number }): void {
    if (this.items.has(c.id)) return;
    this.items.set(c.id, { id: c.id, text: c.text, createdAt: c.createdAt ?? Date.now(), synced: false });
  }

  pending(): QueuedCapture[] {
    return [...this.items.values()].filter((i) => !i.synced).sort((a, b) => a.createdAt - b.createdAt);
  }

  size(): number {
    return this.items.size;
  }

  /** Send all pending items via `sink`, marking them synced. Returns how many were sent. */
  sync(sink: (c: QueuedCapture) => void): number {
    let n = 0;
    for (const item of this.items.values()) {
      if (item.synced) continue;
      sink(item);
      item.synced = true;
      n++;
    }
    return n;
  }
}
