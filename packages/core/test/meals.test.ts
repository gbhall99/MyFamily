import { describe, it, expect } from "vitest";
import { planWeek, blockedAllergens, type Recipe, type Night } from "../src/meals.js";

const recipes: Recipe[] = [
  { id: "r1", name: "Peanut stir fry", allergens: ["peanut"], prepMinutes: 20 },
  { id: "r2", name: "Cheese pasta", allergens: ["dairy", "gluten"], prepMinutes: 25 },
  { id: "r3", name: "Rice & veg bowl", allergens: [], prepMinutes: 15 },
  { id: "r4", name: "Slow chili", allergens: [], prepMinutes: 90 },
];

describe("Meal constraint solver (AC-P7)", () => {
  it("NEVER serves an allergen to a present diner across a full week", () => {
    const nights: Night[] = [
      { date: "Mon", diners: [{ name: "Leo", allergies: ["peanut"] }], availableMinutes: 30 },
      { date: "Tue", diners: [{ name: "Mia", allergies: ["dairy"] }], availableMinutes: 30 },
      { date: "Wed", diners: [{ name: "Leo", allergies: ["peanut"] }, { name: "Mia", allergies: ["dairy", "gluten"] }], availableMinutes: 60 },
    ];
    for (const plan of planWeek(nights, recipes)) {
      if (plan.recipe) {
        const night = nights.find((n) => n.date === plan.date)!;
        const blocked = blockedAllergens(night);
        for (const a of plan.recipe.allergens) expect(blocked.has(a.toLowerCase())).toBe(false);
      }
    }
  });

  it("respects the night's available prep time", () => {
    const nights: Night[] = [{ date: "Mon", diners: [{ name: "Leo", allergies: [] }], availableMinutes: 20 }];
    const [plan] = planWeek(nights, recipes);
    expect(plan!.recipe?.prepMinutes ?? 0).toBeLessThanOrEqual(20);
  });

  it("returns no-pick (never an unsafe meal) when nothing fits", () => {
    const nights: Night[] = [{ date: "Mon", diners: [{ name: "X", allergies: ["peanut", "dairy", "gluten"] }], availableMinutes: 10 }];
    const [plan] = planWeek(nights, recipes);
    expect(plan!.recipe).toBeNull();
  });
});
