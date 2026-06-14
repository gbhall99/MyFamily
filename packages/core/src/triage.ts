/**
 * Inbox / document triage (SPEC §6.6). Classifies incoming items into actionable
 * tasks vs noise. This is a rule-based scaffold with a metric harness (recall of
 * true action items, false-escalation rate) so AC-P11's thresholds are measurable;
 * a model-backed classifier replaces the rules later (stays IN-PROGRESS until then).
 */
export interface InboxItem {
  subject: string;
  body: string;
}

const ACTION_SIGNALS = [
  /\bpermission slip\b/i,
  /\brsvp\b/i,
  /\bdue\b/i,
  /\bsign( and return)?\b/i,
  /\bregister\b/i,
  /\bpayment|pay\b/i,
  /\bbring\b/i,
  /\bdeadline\b/i,
  /\bby (mon|tue|wed|thu|fri|sat|sun|next|\d)/i,
];

export function isActionItem(item: InboxItem): boolean {
  const text = `${item.subject} ${item.body}`;
  return ACTION_SIGNALS.some((re) => re.test(text));
}

export interface TriageMetrics {
  recall: number; // share of true action items correctly flagged
  falseEscalationRate: number; // share of non-actionable items wrongly flagged
}

/** Evaluate the classifier against a labelled corpus (AC-P11 thresholds). */
export function evaluate(labelled: { item: InboxItem; actionable: boolean }[]): TriageMetrics {
  let truePos = 0,
    falseNeg = 0,
    falsePos = 0,
    trueNeg = 0;
  for (const { item, actionable } of labelled) {
    const flagged = isActionItem(item);
    if (actionable && flagged) truePos++;
    else if (actionable && !flagged) falseNeg++;
    else if (!actionable && flagged) falsePos++;
    else trueNeg++;
  }
  const recall = truePos + falseNeg === 0 ? 1 : truePos / (truePos + falseNeg);
  const falseEscalationRate = falsePos + trueNeg === 0 ? 0 : falsePos / (falsePos + trueNeg);
  return { recall, falseEscalationRate };
}
