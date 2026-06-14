// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ApproveChip } from "../src/ApproveChip.js";
import type { Suggestion } from "../src/approve.js";
import type { ActivityEntry } from "../src/activityLog.js";

afterEach(cleanup);

function setup(state: { applied: boolean }) {
  const log: ActivityEntry[] = [];
  const suggestion: Suggestion = {
    id: "swim",
    summary: "Move swim to Thursdays 5:00 PM",
    reason: "from the team email",
    category: "calendar",
    apply: () => {
      state.applied = true;
    },
    revert: () => {
      state.applied = false;
    },
  };
  return { log, suggestion };
}

describe("ApproveChip rendered (AC-DA4, AC-DA5, AC-D10)", () => {
  it("exposes an accessible Approve button labelled with the outcome", () => {
    const state = { applied: false };
    const { log, suggestion } = setup(state);
    render(<ApproveChip suggestion={suggestion} log={log} />);
    expect(screen.getByRole("button", { name: /approve: move swim/i })).toBeInTheDocument();
    // edit + decline present and non-destructive (plain buttons, equal secondary weight)
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /decline/i })).toBeInTheDocument();
  });

  it("one tap accepts, applies the effect, and reveals a visible undo + calm confirmation", () => {
    const state = { applied: false };
    const { log, suggestion } = setup(state);
    render(<ApproveChip suggestion={suggestion} log={log} />);

    fireEvent.click(screen.getByRole("button", { name: /approve/i }));

    expect(state.applied).toBe(true);
    expect(log).toHaveLength(1);
    expect(screen.getByText(/handled\./i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /undo/i })).toBeInTheDocument();
  });

  it("undo reverses the effect", () => {
    const state = { applied: false };
    const { log, suggestion } = setup(state);
    render(<ApproveChip suggestion={suggestion} log={log} />);
    fireEvent.click(screen.getByRole("button", { name: /approve/i }));
    fireEvent.click(screen.getByRole("button", { name: /undo/i }));
    expect(state.applied).toBe(false);
  });

  it("renders in dark theme too (light/dark parity, AC-D4)", () => {
    const state = { applied: false };
    const { log, suggestion } = setup(state);
    render(<ApproveChip suggestion={suggestion} log={log} theme="dark" />);
    expect(screen.getByRole("button", { name: /approve/i })).toBeInTheDocument();
  });
});
