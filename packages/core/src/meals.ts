/**
 * Meal planning constraint solver (SPEC §6.4). HARD constraints are never
 * violated — allergens for any present diner are excluded 100% of the time — and
 * each night's pick must fit that night's available prep time (AC-P7).
 */
export interface Recipe {
  id: string;
  name: string;
  allergens: string[];
  prepMinutes: number;
}

export interface Night {
  date: string;
  /** Members eating that night. */
  diners: { name: string; allergies: string[] }[];
  availableMinutes: number;
}

export type NightPlan =
  | { date: string; recipe: Recipe }
  | { date: string; recipe: null; reason: string };

/** Allergens to avoid for everyone present that night. */
export function blockedAllergens(night: Night): Set<string> {
  const s = new Set<string>();
  for (const d of night.diners) for (const a of d.allergies) s.add(a.toLowerCase());
  return s;
}

function isSafe(recipe: Recipe, blocked: Set<string>): boolean {
  return recipe.allergens.every((a) => !blocked.has(a.toLowerCase()));
}

/** Pick a safe recipe per night. Returns null (with reason) rather than ever serving an allergen. */
export function planWeek(nights: Night[], recipes: Recipe[]): NightPlan[] {
  return nights.map((night) => {
    const blocked = blockedAllergens(night);
    const candidate = recipes.find((r) => isSafe(r, blocked) && r.prepMinutes <= night.availableMinutes);
    return candidate
      ? { date: night.date, recipe: candidate }
      : { date: night.date, recipe: null, reason: "no recipe fits the allergies + time window" };
  });
}
