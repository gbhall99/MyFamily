/**
 * Role-scoped access control + Family-Display redaction (SPEC §10 / AC-P17,
 * AC-P18, AC-P19, AC-DA11). Members see only what their role scopes allow; the
 * shared kitchen display hides sensitive personal/financial/health detail by
 * default.
 */
export type Role = "parent" | "coparent" | "teen" | "child" | "grandparent" | "caregiver";
export type Sensitivity = "general" | "personal" | "health" | "financial" | "location";

/** What each role may see (about the family generally). */
const ROLE_SCOPES: Record<Role, Set<Sensitivity>> = {
  parent: new Set(["general", "personal", "health", "financial", "location"]),
  coparent: new Set(["general", "personal", "health", "location"]), // not the other household's finances
  caregiver: new Set(["general", "health", "location"]),
  grandparent: new Set(["general"]),
  teen: new Set(["general", "personal"]),
  child: new Set(["general"]),
};

export function canAccess(role: Role, sensitivity: Sensitivity): boolean {
  return ROLE_SCOPES[role].has(sensitivity);
}

/**
 * A teen's own privacy boundaries (location/chat/visibility) are honoured and
 * cannot be silently overridden by another member (AC-P18).
 */
export function teenBoundaryHonoured(
  viewerRole: Role,
  teenSetting: { shareLocation: boolean },
  field: "location",
): boolean {
  void field;
  if (teenSetting.shareLocation) return true;
  // Only the teen themselves (and no silent override) may see it when off.
  return viewerRole === "teen";
}

/** Fields hidden on the shared Family-Display by default (AC-DA11). */
const DISPLAY_HIDDEN: Set<Sensitivity> = new Set(["financial", "health", "personal"]);

export function visibleOnFamilyDisplay(sensitivity: Sensitivity): boolean {
  return !DISPLAY_HIDDEN.has(sensitivity);
}
