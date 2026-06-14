import { describe, it, expect } from "vitest";
import { reconcile, reconcilesWithinWindow, MockCalendarProvider, type ExternalEvent } from "../src/sync.js";
import { buildCart, diffCart, MockGroceryProvider, type PlannedMeal } from "../src/grocery.js";

const ev = (uid: string, updatedAt: number, title: string, source: ExternalEvent["source"]): ExternalEvent => ({
  uid,
  etag: `${uid}-${updatedAt}`,
  title,
  start: 0,
  end: 0,
  updatedAt,
  source,
});

describe("Two-way calendar sync (AC-P4)", () => {
  it("reconciles the same event from two systems with no duplicate (last-write-wins)", () => {
    const local = [ev("swim-1", 100, "Swim", "myfamily")];
    const remote = [ev("swim-1", 200, "Swim (moved to Thu)", "google")];
    const { merged, duplicatesCollapsed } = reconcile(local, remote);
    expect(merged).toHaveLength(1);
    expect(merged[0]!.title).toBe("Swim (moved to Thu)"); // newer wins
    expect(duplicatesCollapsed).toBe(1);
  });

  it("a change pushed to a provider converges on pull, still no duplicates", () => {
    const provider = new MockCalendarProvider([ev("a", 1, "A", "google"), ev("b", 1, "B", "google")]);
    provider.push([ev("a", 5, "A edited", "myfamily")]);
    const pulled = provider.pull();
    expect(pulled).toHaveLength(2);
    expect(pulled.find((e) => e.uid === "a")!.title).toBe("A edited");
  });

  it("confirms reconciliation fits the 60s window", () => {
    expect(reconcilesWithinWindow(1500)).toBe(true);
    expect(reconcilesWithinWindow(90_000)).toBe(false);
  });
});

describe("Meals → grocery closed loop (AC-P8)", () => {
  const monday: PlannedMeal = {
    recipeId: "pasta",
    ingredients: [
      { name: "Pasta", qty: 1, unit: "box" },
      { name: "Tomato", qty: 3, unit: "ea" },
    ],
  };
  const thursday: PlannedMeal = {
    recipeId: "salad",
    ingredients: [{ name: "Tomato", qty: 2, unit: "ea" }],
  };

  it("builds a correct de-duplicated cart from the plan", () => {
    const cart = buildCart([monday, thursday]);
    const tomato = cart.find((l) => l.name === "Tomato")!;
    expect(tomato.qty).toBe(5); // 3 + 2 aggregated
    expect(cart).toHaveLength(2);
  });

  it("places the order in the sandbox", () => {
    const order = new MockGroceryProvider().placeOrder(buildCart([monday]));
    expect(order.placed).toBe(true);
    expect(order.lines).toHaveLength(2);
  });

  it("updates the order when Thursday's plan changes", () => {
    const provider = new MockGroceryProvider();
    const oldCart = buildCart([monday, thursday]);
    const order = provider.placeOrder(oldCart);

    // Thursday swapped to a recipe needing cheese instead of extra tomato
    const newThursday: PlannedMeal = { recipeId: "toastie", ingredients: [{ name: "Cheese", qty: 1, unit: "block" }] };
    const newCart = buildCart([monday, newThursday]);

    const updated = provider.updateOrder(order, diffCart(oldCart, newCart));
    expect(updated.lines.find((l) => l.name === "Cheese")).toBeDefined();
    expect(updated.lines.find((l) => l.name === "Tomato")!.qty).toBe(3); // back down to Monday-only
  });
});
