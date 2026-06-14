/**
 * Document triage & retrieval (SPEC §6.6 / AC-P12). A signed permission-slip task
 * is tracked until completion, and the underlying document is retrievable at the
 * moment of need (instant in-memory search → well under the 5s target).
 */
export interface Doc {
  id: string;
  title: string;
  text: string;
  tags: string[];
}

export class DocStore {
  private docs: Doc[] = [];
  add(d: Doc): void {
    this.docs.push(d);
  }
  /** Full-text-ish search across title/body/tags. */
  search(query: string): Doc[] {
    const k = query.toLowerCase();
    return this.docs.filter((d) => `${d.title} ${d.text} ${d.tags.join(" ")}`.toLowerCase().includes(k));
  }
}

export interface SlipTask {
  id: string;
  child: string;
  docId: string;
  done: boolean;
}

export function completeTask(t: SlipTask): SlipTask {
  return { ...t, done: true };
}
