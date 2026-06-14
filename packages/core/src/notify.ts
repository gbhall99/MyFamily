/**
 * The calm notification budget (SPEC §9 / AC-G6 / AC-D12). Only genuinely urgent,
 * time-critical items may push; everything else is consolidated into the Daily
 * Brief. A feature must add ZERO net default push notifications.
 */
export type Urgency = "urgent" | "routine";

export interface Notifiable {
  id: string;
  urgency: Urgency;
}

export type Channel = "push" | "brief";

export function routeNotification(n: Notifiable): Channel {
  return n.urgency === "urgent" ? "push" : "brief";
}

/** Net new default push notifications a batch would add — must be 0 for routine items. */
export function netDefaultPushes(items: Notifiable[]): number {
  return items.filter((n) => routeNotification(n) === "push").length;
}
