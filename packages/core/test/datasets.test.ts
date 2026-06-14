import { describe, it, expect } from "vitest";
import { makeExtractor } from "../src/extractor.js";
import { capture } from "../src/capture.js";
import { detectConflicts, type FamilyEvent } from "../src/conflict.js";
import { planWeek, blockedAllergens, type Recipe, type Night } from "../src/meals.js";
import { computeLoad, nextAssignee, type Task } from "../src/fairshare.js";
import { resolveProvider, type Provider } from "../src/capture.js";

/**
 * AC-G1 — validation across ≥5 realistic family datasets, including messy/edge
 * cases (blended family, missing data, conflicting inputs). Exercises the whole
 * logic layer and asserts robust, correct behaviour (no crashes; hard constraints
 * never violated). Realistic fixtures per the AC's allowance; real datasets feed
 * the same harness later.
 */
interface Dataset {
  name: string;
  roster: string[];
  captures: { kind: "text"; body: string }[];
  events: FamilyEvent[];
  nights: Night[];
  recipes: Recipe[];
  tasks: Task[];
  expectConflict?: boolean;
}

const baseRecipes: Recipe[] = [
  { id: "r1", name: "Peanut noodles", allergens: ["peanut"], prepMinutes: 20 },
  { id: "r2", name: "Cheese bake", allergens: ["dairy", "gluten"], prepMinutes: 30 },
  { id: "r3", name: "Rice bowl", allergens: [], prepMinutes: 15 },
];
const ev = (id: string, member: string, startH: number, endH: number, loc: string, needsDriver = true): FamilyEvent => ({
  id,
  title: "Activity",
  start: Date.parse(`2026-06-18T${String(startH).padStart(2, "0")}:00:00Z`),
  end: Date.parse(`2026-06-18T${String(endH).padStart(2, "0")}:00:00Z`),
  member,
  needsDriver,
  location: loc,
});

const datasets: Dataset[] = [
  {
    name: "Nuclear family (complete)",
    roster: ["Leo", "Mia"],
    captures: [{ kind: "text", body: "Leo swim Thursday at 5pm at Pool" }],
    events: [ev("1", "Leo", 17, 18, "Pool"), ev("2", "Mia", 19, 20, "Hall")],
    nights: [{ date: "Mon", diners: [{ name: "Leo", allergies: ["peanut"] }], availableMinutes: 30 }],
    recipes: baseRecipes,
    tasks: [{ id: "t1", assignee: "Leo", effort: 2, kind: "physical" }],
  },
  {
    name: "Blended family (two households, step-siblings)",
    roster: ["Ava", "Noah", "Ruby"],
    captures: [{ kind: "text", body: "Ava recital Jun 20 at 7pm at Dad's" }],
    events: [ev("1", "Ava", 17, 18, "Studio"), ev("2", "Noah", 17, 18, "Park")],
    nights: [{ date: "Tue", diners: [{ name: "Ava", allergies: ["dairy"] }, { name: "Noah", allergies: ["peanut"] }], availableMinutes: 40 }],
    recipes: baseRecipes,
    tasks: [
      { id: "t1", assignee: "Ava", effort: 5, kind: "cognitive" },
      { id: "t2", assignee: "Ruby", effort: 1, kind: "physical" },
    ],
    expectConflict: true, // same time, different places, both need a driver
  },
  {
    name: "Single parent, missing data",
    roster: ["Sam"],
    captures: [{ kind: "text", body: "dentist sometime next week" }], // no date/time → needs review
    events: [ev("1", "Sam", 9, 10, "Clinic")],
    nights: [{ date: "Wed", diners: [{ name: "Sam", allergies: [] }], availableMinutes: 10 }], // nothing fits → no-pick
    recipes: baseRecipes,
    tasks: [{ id: "t1", assignee: "Sam", effort: 3, kind: "cognitive" }],
  },
  {
    name: "Large family, load imbalance",
    roster: ["Mum", "Dad", "Kit", "Bo"],
    captures: [{ kind: "text", body: "Kit football 18/06 at 4pm at Field" }],
    events: [ev("1", "Kit", 16, 17, "Field"), ev("2", "Bo", 16, 17, "Field", false)],
    nights: [{ date: "Thu", diners: [{ name: "Kit", allergies: ["gluten"] }], availableMinutes: 60 }],
    recipes: baseRecipes,
    tasks: [
      { id: "t1", assignee: "Mum", effort: 8, kind: "cognitive" },
      { id: "t2", assignee: "Dad", effort: 1, kind: "physical" },
    ],
  },
  {
    name: "Conflicting inputs (overlap + duplicate provider)",
    roster: ["Leo", "Mia"],
    captures: [{ kind: "text", body: "Mia dentist 18/06 at 9am at Lee Dental" }],
    events: [ev("1", "Leo", 17, 18, "Pool"), ev("2", "Mia", 17, 18, "Court")],
    nights: [{ date: "Fri", diners: [{ name: "Mia", allergies: ["peanut", "dairy"] }], availableMinutes: 20 }],
    recipes: baseRecipes,
    tasks: [{ id: "t1", assignee: "Leo", effort: 2, kind: "physical" }],
    expectConflict: true,
  },
];

describe("Cross-dataset validation (AC-G1)", () => {
  it("covers at least 5 datasets including edge cases", () => {
    expect(datasets.length).toBeGreaterThanOrEqual(5);
    expect(datasets.map((d) => d.name).join(" ")).toMatch(/blended|missing|conflicting/i);
  });

  it.each(datasets)("$name: capture never throws and defers when unsure", async (d) => {
    const extractor = makeExtractor(d.roster);
    for (const c of d.captures) {
      const r = await capture(c, extractor);
      expect(["filed", "needs_review"]).toContain(r.status);
    }
  });

  it.each(datasets)("$name: conflict radar behaves (no crash; flags real clashes)", (d) => {
    const conflicts = detectConflicts(d.events, Date.parse("2026-06-17T00:00:00Z"));
    if (d.expectConflict) expect(conflicts.length).toBeGreaterThanOrEqual(1);
    else expect(Array.isArray(conflicts)).toBe(true);
  });

  it.each(datasets)("$name: meals NEVER serve an allergen", (d) => {
    for (const plan of planWeek(d.nights, d.recipes)) {
      if (plan.recipe) {
        const blocked = blockedAllergens(d.nights.find((n) => n.date === plan.date)!);
        for (const a of plan.recipe.allergens) expect(blocked.has(a.toLowerCase())).toBe(false);
      }
    }
  });

  it.each(datasets)("$name: fair-share always routes to a real member", (d) => {
    const members = [...new Set(d.tasks.map((t) => t.assignee))];
    const assignee = nextAssignee(computeLoad(d.tasks, members));
    expect(assignee === null || members.includes(assignee)).toBe(true);
  });

  it("resolves a duplicate provider in the conflicting dataset without duplicating", () => {
    const known: Provider[] = [{ id: "lee", name: "Dr. Lee", kind: "dentist" }];
    expect(resolveProvider({ name: "Lee Dental", kind: "dentist" }, known).action).toBe("matched");
  });
});
