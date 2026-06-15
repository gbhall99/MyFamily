/**
 * Travel — trip brain (SPEC §6.11② / AC-P34). Generates a per-member packing list
 * from the itinerary length, the weather, and the planned activities, so nothing
 * is forgotten. (End-to-end booking is AC-P35, gated on live integrations.)
 */
export type Weather = "cold" | "warm" | "wet" | "mild";

export interface TripContext {
  nights: number;
  weather: Weather;
  activities: string[];
  members: string[];
}

export interface MemberPacking {
  member: string;
  items: string[];
}

export function packingList(ctx: TripContext): MemberPacking[] {
  const days = ctx.nights + 1;
  return ctx.members.map((member) => {
    const items = [`${days} tops`, `${days} sets of underwear`, "toothbrush", "phone charger"];
    if (ctx.weather === "cold") items.push("warm coat", "hat & gloves");
    if (ctx.weather === "wet") items.push("raincoat", "umbrella");
    if (ctx.weather === "warm") items.push("sun cream", "sun hat");
    if (ctx.activities.includes("swimming")) items.push("swimsuit", "towel");
    if (ctx.activities.includes("hiking")) items.push("walking boots");
    if (ctx.activities.includes("formal")) items.push("smart outfit");
    return { member, items };
  });
}
