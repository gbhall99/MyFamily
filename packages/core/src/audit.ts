/**
 * Tamper-evident activity log (SPEC §7.4 / AC-X6, AC-G5). Every agent action is
 * appended as an entry (who/what/why/when) linked into a hash chain, so the log
 * is append-only and any silent edit breaks verification. Undo is itself an
 * appended action, never a mutation of history. (Uses a fast checksum chain;
 * production would swap in a cryptographic hash + signed storage.)
 */
export interface AuditEntry {
  seq: number;
  who: string; // the agent or member
  what: string; // the action taken
  why: string; // plain-language reason
  at: number;
  prevHash: string;
  hash: string;
}

// FNV-1a 32-bit — deterministic, dependency-free, isomorphic (node + browser).
function checksum(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

const content = (e: Omit<AuditEntry, "hash">): string => `${e.seq}|${e.who}|${e.what}|${e.why}|${e.at}|${e.prevHash}`;

export function appendAudit(log: AuditEntry[], a: { who: string; what: string; why: string; at?: number }): AuditEntry {
  const seq = log.length;
  const prevHash = seq === 0 ? "genesis" : log[seq - 1]!.hash;
  const base = { seq, who: a.who, what: a.what, why: a.why, at: a.at ?? Date.now(), prevHash };
  const entry: AuditEntry = { ...base, hash: checksum(content(base)) };
  log.push(entry);
  return entry;
}

/** Record an undo as its own appended action (history is never rewritten). */
export function appendUndo(log: AuditEntry[], targetSeq: number, who: string): AuditEntry {
  const target = log[targetSeq];
  return appendAudit(log, { who, what: `Undid: ${target?.what ?? `#${targetSeq}`}`, why: `reverted action #${targetSeq}` });
}

/** Verify the chain is intact. A broken link or edited content reports brokenAt. */
export function verifyChain(log: AuditEntry[]): { valid: boolean; brokenAt?: number } {
  let prev = "genesis";
  for (let i = 0; i < log.length; i++) {
    const e = log[i]!;
    if (e.prevHash !== prev) return { valid: false, brokenAt: i };
    if (e.hash !== checksum(content(e))) return { valid: false, brokenAt: i };
    prev = e.hash;
  }
  return { valid: true };
}
