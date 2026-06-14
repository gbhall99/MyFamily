import { describe, it, expect } from "vitest";
import { assembleBrief, MAX_DECISIONS, type Decision } from "../src/brief.js";
import { buildCart, type PlannedMeal } from "../src/grocery.js";

/**
 * Perf + glanceability proxies (AC-G7 "<2s interactive", AC-D13 "<3s glanceable").
 * jsdom/node can't measure real device timing, so this asserts the core view-model
 * assembly is far under budget and the surface stays glanceable (≤3 decisions);
 * real on-device timing is the remaining half.
 */
describe("Performance budget proxy (AC-G7)", () => {
  it("assembles a busy day's brief well under an interactive budget", () => {
    const decisions: Decision[] = Array.from({ length: 50 }, (_, i) => ({ id: `d${i}`, prompt: `q${i}`, priority: i }));
    const logistics = Array.from({ length: 40 }, (_, i) => `Item ${i}`);

    const t0 = performance.now();
    for (let i = 0; i < 200; i++) assembleBrief({ logistics, conflicts: [], decisions, handled: logistics });
    const perRun = (performance.now() - t0) / 200;

    expect(perRun).toBeLessThan(50); // ms — orders of magnitude under the 2s budget
  });

  it("builds a large grocery cart quickly", () => {
    const meals: PlannedMeal[] = Array.from({ length: 21 }, (_, i) => ({
      recipeId: `r${i}`,
      ingredients: [
        { name: `Item${i % 7}`, qty: 1, unit: "ea" },
        { name: "Salt", qty: 1, unit: "g" },
      ],
    }));
    const t0 = performance.now();
    const cart = buildCart(meals);
    expect(performance.now() - t0).toBeLessThan(50);
    expect(cart.find((l) => l.name === "Salt")!.qty).toBe(21); // aggregated correctly
  });
});

describe("Glanceability proxy (AC-D13)", () => {
  it("keeps the primary value to ≤3 one-tap decisions", () => {
    const decisions: Decision[] = Array.from({ length: 9 }, (_, i) => ({ id: `d${i}`, prompt: `q${i}`, priority: i }));
    const brief = assembleBrief({ logistics: ["a"], conflicts: [], decisions, handled: ["b"] });
    expect(brief.decisions.length).toBeLessThanOrEqual(MAX_DECISIONS);
    // a one-line glanceable summary is derivable
    const summary = `${brief.decisions.length} to decide · ${brief.handled.length} handled`;
    expect(summary.length).toBeLessThan(40);
  });
});
