import { describe, it, expect } from "vitest";
import { detectMoneyLeaks, splitExpenses, settlement, type Subscription, type Expense } from "../src/money.js";

describe("Money leak detection (AC-P30)", () => {
  const subs: Subscription[] = [
    { name: "StreamCo", monthly: 12.99, lastMonthly: 9.99 }, // price creep
    { name: "GymApp", monthly: 19.99, lastUsedDaysAgo: 90 }, // unused
    { name: "CloudStore", monthly: 2.99, renewsInDays: 5 }, // renews soon
    { name: "Music", monthly: 9.99, lastMonthly: 9.99, lastUsedDaysAgo: 1 }, // fine
  ];

  it("flags price increases, unused subs, and imminent renewals — and nothing else", () => {
    const flags = detectMoneyLeaks(subs);
    expect(flags.find((f) => f.name === "StreamCo")?.reason).toBe("price_increase");
    expect(flags.find((f) => f.name === "GymApp")?.reason).toBe("unused");
    expect(flags.find((f) => f.name === "CloudStore")?.reason).toBe("renewal_soon");
    expect(flags.some((f) => f.name === "Music")).toBe(false);
  });
});

describe("Fair co-parent split + auditable ledger (AC-P30)", () => {
  const expenses: Expense[] = [
    { id: "e1", description: "School trip", amount: 60, payer: "Maya", sharedBy: ["Maya", "Devin"] },
    { id: "e2", description: "Football kit", amount: 40, payer: "Devin", sharedBy: ["Maya", "Devin"] },
  ];

  it("produces a balanced split with a per-expense audit trail", () => {
    const { ledger, balances } = splitExpenses(expenses, ["Maya", "Devin"]);
    expect(ledger).toHaveLength(2); // one auditable entry per expense
    // Maya paid 60 (owes 30 of each) → net +10; Devin paid 40 → net −10
    expect(balances.Maya).toBe(10);
    expect(balances.Devin).toBe(-10);
    expect(Math.round((balances.Maya! + balances.Devin!) * 100) / 100).toBe(0); // sums to zero
  });

  it("computes who-owes-whom to settle", () => {
    const { balances } = splitExpenses(expenses, ["Maya", "Devin"]);
    expect(settlement(balances, "Maya", "Devin")).toEqual({ from: "Devin", to: "Maya", amount: 10 });
  });

  it("is deterministic — both co-parents reconstruct the same ledger", () => {
    const a = splitExpenses(expenses, ["Maya", "Devin"]);
    const b = splitExpenses(expenses, ["Devin", "Maya"]);
    expect(a.ledger).toEqual(b.ledger);
    expect(a.balances).toEqual(b.balances);
  });
});
