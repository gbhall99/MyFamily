/**
 * Money & household admin (SPEC §6.9② / AC-P30). Flags renewals / price-creep /
 * unused subscriptions, and produces a fair co-parent expense split with an
 * auditable ledger both sides can reconstruct identically. No money moves here —
 * acting on these (pay/settle) is gated by per-instance approval (AC-P31).
 */
export interface Subscription {
  name: string;
  monthly: number;
  lastMonthly?: number; // previous price, to detect creep
  lastUsedDaysAgo?: number;
  renewsInDays?: number;
}

export interface MoneyFlag {
  name: string;
  reason: "price_increase" | "unused" | "renewal_soon";
  detail: string;
}

export function detectMoneyLeaks(subs: Subscription[], opts: { unusedDays?: number; renewalWindow?: number } = {}): MoneyFlag[] {
  const unusedDays = opts.unusedDays ?? 60;
  const renewalWindow = opts.renewalWindow ?? 14;
  const flags: MoneyFlag[] = [];
  for (const s of subs) {
    if (s.lastMonthly != null && s.monthly > s.lastMonthly) {
      flags.push({ name: s.name, reason: "price_increase", detail: `£${s.lastMonthly.toFixed(2)} → £${s.monthly.toFixed(2)}/mo` });
    }
    if (s.lastUsedDaysAgo != null && s.lastUsedDaysAgo >= unusedDays) {
      flags.push({ name: s.name, reason: "unused", detail: `not used in ${s.lastUsedDaysAgo} days · £${s.monthly.toFixed(2)}/mo` });
    }
    if (s.renewsInDays != null && s.renewsInDays <= renewalWindow) {
      flags.push({ name: s.name, reason: "renewal_soon", detail: `renews in ${s.renewsInDays} days` });
    }
  }
  return flags;
}

// --- Fair co-parent expense split + auditable ledger -------------------------

export interface Expense {
  id: string;
  description: string;
  amount: number;
  payer: string;
  sharedBy: string[]; // who the cost is split across
}

export interface LedgerEntry {
  id: string;
  description: string;
  payer: string;
  amount: number;
  perPerson: number;
}

export interface SplitResult {
  ledger: LedgerEntry[];
  /** Net per member: positive = owed to them, negative = they owe. Sums to ~0. */
  balances: Record<string, number>;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function splitExpenses(expenses: Expense[], members: string[]): SplitResult {
  const balances: Record<string, number> = Object.fromEntries(members.map((m) => [m, 0]));
  const ledger: LedgerEntry[] = [];
  for (const e of expenses) {
    const perPerson = e.amount / e.sharedBy.length;
    ledger.push({ id: e.id, description: e.description, payer: e.payer, amount: e.amount, perPerson: round2(perPerson) });
    balances[e.payer] = round2((balances[e.payer] ?? 0) + e.amount); // they fronted it
    for (const m of e.sharedBy) balances[m] = round2((balances[m] ?? 0) - perPerson); // their share
  }
  return { ledger, balances };
}

/** Who-owes-whom to settle a two-person balance. */
export function settlement(balances: Record<string, number>, a: string, b: string): { from: string; to: string; amount: number } {
  const bal = balances[a] ?? 0; // a is owed (positive) or owes (negative)
  return bal >= 0 ? { from: b, to: a, amount: round2(bal) } : { from: a, to: b, amount: round2(-bal) };
}
