import { describe, it, expect } from "vitest";
import { healthPrompts, type Medication, type RoutineVisit } from "../src/health.js";
import { packingList, type TripContext } from "../src/travel.js";
import { distributeCare } from "../src/care.js";

const DAY = 86_400_000;
const NOW = Date.parse("2026-06-15T00:00:00Z");

describe("Health prompts (AC-P28)", () => {
  const meds: Medication[] = [
    { name: "Inhaler", member: "Leo", daysSupplyLeft: 4 }, // low → refill
    { name: "Vitamin D", member: "Maya", daysSupplyLeft: 40 }, // fine
  ];
  const visits: RoutineVisit[] = [
    { member: "Mia", kind: "annual physical", lastDoneAt: NOW - 400 * DAY, intervalDays: 365 }, // overdue → book
    { member: "Devin", kind: "eye test", lastDoneAt: NOW - 100 * DAY, intervalDays: 730 }, // fine
  ];

  it("prompts a refill before run-out and a booking before a due visit, nothing else", () => {
    const prompts = healthPrompts(meds, visits, NOW);
    expect(prompts).toHaveLength(2);
    expect(prompts.find((p) => p.kind === "refill")?.member).toBe("Leo");
    expect(prompts.find((p) => p.kind === "book_visit")?.member).toBe("Mia");
  });
});

describe("Travel packing (AC-P34)", () => {
  it("builds a per-member list from nights + weather + activities", () => {
    const ctx: TripContext = { nights: 2, weather: "cold", activities: ["swimming"], members: ["Leo", "Mia"] };
    const lists = packingList(ctx);
    expect(lists).toHaveLength(2);
    const leo = lists[0]!;
    expect(leo.items).toContain("3 tops"); // nights + 1
    expect(leo.items).toContain("warm coat"); // cold
    expect(leo.items).toContain("swimsuit"); // swimming
  });
});

describe("Eldercare distribution (AC-P33)", () => {
  it("shares tasks onto the least-loaded sibling", () => {
    const tasks = [{ id: "t1" }, { id: "t2" }, { id: "t3" }, { id: "t4" }];
    const out = distributeCare(tasks, ["Sam", "Jo"], { Sam: 2, Jo: 0 });
    // Jo starts behind, so should pick up the first tasks until balanced
    const samCount = out.filter((a) => a.assignee === "Sam").length;
    const joCount = out.filter((a) => a.assignee === "Jo").length;
    expect(samCount + joCount).toBe(4);
    expect(joCount).toBeGreaterThan(samCount); // balancing toward the under-loaded sibling
  });
});
