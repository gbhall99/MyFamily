import { describe, it, expect } from "vitest";
import { appendAudit, appendUndo, verifyChain, type AuditEntry } from "../src/audit.js";

function seed(): AuditEntry[] {
  const log: AuditEntry[] = [];
  appendAudit(log, { who: "scheduler", what: "Moved swim to Thursday", why: "from the team email", at: 1 });
  appendAudit(log, { who: "provisioner", what: "Reordered dish soap", why: "about to run out", at: 2 });
  appendAudit(log, { who: "inbox", what: "Filed permission slip", why: "school newsletter", at: 3 });
  return log;
}

describe("Tamper-evident activity log (AC-X6, AC-G5)", () => {
  it("each entry reconstructs who/what/why/when", () => {
    const log = seed();
    expect(log[0]).toMatchObject({ who: "scheduler", what: "Moved swim to Thursday", why: "from the team email", at: 1 });
    expect(log).toHaveLength(3);
  });

  it("verifies an intact chain", () => {
    expect(verifyChain(seed())).toEqual({ valid: true });
  });

  it("detects a silent edit of any entry", () => {
    const log = seed();
    log[1]!.what = "Reordered something expensive"; // tamper
    expect(verifyChain(log)).toEqual({ valid: false, brokenAt: 1 });
  });

  it("detects a deleted/reordered entry (broken link)", () => {
    const log = seed();
    log.splice(1, 1); // remove the middle entry
    expect(verifyChain(log).valid).toBe(false);
  });

  it("records undo as a new appended action, leaving history intact", () => {
    const log = seed();
    appendUndo(log, 0, "Maya");
    expect(log).toHaveLength(4);
    expect(log[3]!.what).toMatch(/Undid: Moved swim/);
    expect(log[0]!.what).toBe("Moved swim to Thursday"); // original untouched
    expect(verifyChain(log)).toEqual({ valid: true });
  });
});
