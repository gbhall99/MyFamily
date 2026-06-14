/**
 * Agentic co-pilot planner (SPEC §7 / AC-P13). A natural-language goal ("sort out
 * Leo's party") returns an approvable, EDITABLE plan covering date, logistics,
 * invites, tasks, and provisioning — a structured plan, not a chat reply. This is
 * a deterministic scaffold; a model-backed planner replaces the templating later
 * (the AC stays IN-PROGRESS until then).
 */
export interface PlanSection {
  key: "date" | "logistics" | "invites" | "tasks" | "provisioning";
  title: string;
  items: string[];
}

export interface Plan {
  goal: string;
  subject: string;
  sections: PlanSection[];
  editable: true;
  approvable: true;
}

const SUBJECT_RE = /(?:for|sort out|plan|organi[sz]e)\s+([a-z][\w']*(?:'s)?(?:\s+[a-z]+)?)/i;

export function planGoal(goal: string): Plan {
  const subject = SUBJECT_RE.exec(goal)?.[1]?.trim() ?? goal.trim();
  return {
    goal,
    subject,
    editable: true,
    approvable: true,
    sections: [
      { key: "date", title: "Date & time", items: [`Pick a date for ${subject}`, "Check the family calendar for conflicts"] },
      { key: "logistics", title: "Logistics", items: ["Choose a venue/location", "Plan transport"] },
      { key: "invites", title: "Invites", items: ["Draft the guest list", "Send invites & track RSVPs"] },
      { key: "tasks", title: "Tasks", items: ["Assign prep tasks across the family", "Set reminders"] },
      { key: "provisioning", title: "Provisioning", items: ["Order food/supplies", "Arrange any bookings"] },
    ],
  };
}
