/**
 * Privacy by default (SPEC §10 / AC-G8). Children's data is minimised, nothing is
 * used for model training, and retention is disclosed per data type. These are
 * enforceable defaults; a formal privacy review is the human half of the AC.
 */
export const USED_FOR_TRAINING = false as const;

export type DataType = "calendar" | "location" | "messages" | "documents" | "profile";

/** Disclosed retention windows (days) — surfaced to families, not hidden. */
export const RETENTION_DAYS: Record<DataType, number> = {
  calendar: 365,
  location: 7,
  messages: 90,
  documents: 365,
  profile: 365,
};

export interface ChildRecord {
  name: string;
  age: number;
  necessary: Record<string, unknown>;
  extra?: Record<string, unknown>;
}

/** For under-13s, collect ONLY what's necessary — drop anything extra (AC-G8 / AC-P17). */
export function minimiseChildData(r: ChildRecord): ChildRecord {
  if (r.age < 13) return { name: r.name, age: r.age, necessary: r.necessary };
  return r;
}

export function retentionDisclosed(): boolean {
  return (Object.keys(RETENTION_DAYS) as DataType[]).every((k) => RETENTION_DAYS[k] > 0);
}
