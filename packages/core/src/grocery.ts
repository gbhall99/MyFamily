/**
 * Meals → grocery closed loop (SPEC §6.4 / AC-P8). An approved plan builds a
 * correct, de-duplicated cart; placing it goes through a provider (sandbox mock
 * until live credentials are approved); and changing a night's plan updates the
 * cart/order via a diff. Live ordering is the remaining half.
 */
export interface Ingredient {
  name: string;
  qty: number;
  unit: string;
}
export interface PlannedMeal {
  recipeId: string;
  ingredients: Ingredient[];
}
export interface CartLine {
  name: string;
  qty: number;
  unit: string;
}

const key = (name: string, unit: string) => `${name.toLowerCase()}|${unit.toLowerCase()}`;

/** Aggregate all meals' ingredients into a de-duplicated cart (same name+unit summed). */
export function buildCart(meals: PlannedMeal[]): CartLine[] {
  const lines = new Map<string, CartLine>();
  for (const meal of meals) {
    for (const ing of meal.ingredients) {
      const k = key(ing.name, ing.unit);
      const prev = lines.get(k);
      if (prev) prev.qty += ing.qty;
      else lines.set(k, { name: ing.name, qty: ing.qty, unit: ing.unit });
    }
  }
  return [...lines.values()];
}

export interface CartDiff {
  added: CartLine[];
  removed: CartLine[];
  changed: { name: string; unit: string; from: number; to: number }[];
}

/** What changes when the plan changes — used to update an existing order. */
export function diffCart(oldCart: CartLine[], newCart: CartLine[]): CartDiff {
  const oldMap = new Map(oldCart.map((l) => [key(l.name, l.unit), l]));
  const newMap = new Map(newCart.map((l) => [key(l.name, l.unit), l]));
  const added: CartLine[] = [];
  const removed: CartLine[] = [];
  const changed: CartDiff["changed"] = [];
  for (const [k, l] of newMap) {
    const prev = oldMap.get(k);
    if (!prev) added.push(l);
    else if (prev.qty !== l.qty) changed.push({ name: l.name, unit: l.unit, from: prev.qty, to: l.qty });
  }
  for (const [k, l] of oldMap) if (!newMap.has(k)) removed.push(l);
  return { added, removed, changed };
}

export interface Order {
  lines: CartLine[];
  placed: boolean;
}

export interface GroceryProvider {
  placeOrder(cart: CartLine[]): Order;
  updateOrder(order: Order, diff: CartDiff): Order;
}

/** Sandbox provider — never contacts a real store. */
export class MockGroceryProvider implements GroceryProvider {
  placeOrder(cart: CartLine[]): Order {
    return { lines: [...cart], placed: true };
  }
  updateOrder(order: Order, diff: CartDiff): Order {
    const lines = new Map(order.lines.map((l) => [key(l.name, l.unit), { ...l }]));
    for (const a of diff.added) lines.set(key(a.name, a.unit), { ...a });
    for (const c of diff.changed) {
      const l = lines.get(key(c.name, c.unit));
      if (l) l.qty = c.to;
    }
    for (const r of diff.removed) lines.delete(key(r.name, r.unit));
    return { lines: [...lines.values()], placed: order.placed };
  }
}
