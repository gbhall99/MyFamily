// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemberChip } from "../src/MemberChip.js";
import { DailyBriefCard, type BriefVM } from "../src/DailyBriefCard.js";
import { AutonomyLadder } from "../src/AutonomyLadder.js";
import { motionDuration } from "../src/motion.js";

afterEach(cleanup);

describe("MemberChip (AC-DA2, AC-D9, AC-D10)", () => {
  it("shows the initial (non-colour cue) and an accessible name", () => {
    render(<MemberChip name="Leo" accentIndex={0} />);
    expect(screen.getByText("L")).toBeInTheDocument(); // initial present, not colour-only
    expect(screen.getByLabelText("Leo")).toBeInTheDocument();
  });
});

describe("DailyBriefCard (AC-DA6, AC-P16, AC-D10)", () => {
  const brief: BriefVM = {
    logistics: ["School run 8:15", "Swim 5:00"],
    conflicts: ["Soccer & swim overlap Thursday"],
    decisions: [
      { id: "d1", prompt: "Ask Sam to drive?" },
      { id: "d2", prompt: "Move dentist?" },
    ],
    handled: ["Booked haircut"],
  };

  it("renders the four sections with accessible headings and tappable decisions", () => {
    const tapped: string[] = [];
    render(<DailyBriefCard brief={brief} onDecide={(id) => tapped.push(id)} />);
    expect(screen.getByRole("group", { name: /daily brief/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /today/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /needs a tap/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /already handled/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /ask sam to drive/i }));
    expect(tapped).toEqual(["d1"]);
  });

  it("renders in dark theme (light/dark parity, AC-D4)", () => {
    render(<DailyBriefCard brief={brief} theme="dark" />);
    expect(screen.getByRole("group", { name: /daily brief/i })).toBeInTheDocument();
  });
});

describe("AutonomyLadder (AC-DA7, AC-D10)", () => {
  it("exposes radios with consequence copy and marks the selected level", () => {
    const picked: string[] = [];
    render(<AutonomyLadder value="suggest" onChange={(l) => picked.push(l)} />);
    const suggest = screen.getByRole("radio", { name: /suggest.*ask before/i });
    expect(suggest).toHaveAttribute("aria-checked", "true");
    fireEvent.click(screen.getByRole("radio", { name: /full auto/i }));
    expect(picked).toEqual(["full_auto"]);
  });
});

describe("Reduced motion (AC-D8)", () => {
  it("collapses every duration to instant when reduced motion is on", () => {
    expect(motionDuration("base", false)).toBeGreaterThan(0);
    expect(motionDuration("base", true)).toBe(0);
    expect(motionDuration("slow", true)).toBe(0);
  });
});
