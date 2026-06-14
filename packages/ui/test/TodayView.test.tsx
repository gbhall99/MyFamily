// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { TodayView, type Member } from "../src/TodayView.js";
import type { BriefVM } from "../src/DailyBriefCard.js";

afterEach(cleanup);

const members: Member[] = [
  { name: "Maya", accentIndex: 0 },
  { name: "Devin", accentIndex: 1 },
  { name: "Leo", accentIndex: 2 },
];
const brief: BriefVM = {
  logistics: ["School run 8:15"],
  conflicts: ["Soccer & swim overlap Thursday"],
  decisions: [{ id: "d1", prompt: "Ask Sam to drive?" }],
  handled: ["Booked haircut"],
};

describe("TodayView screen (composition, AC-D10, AC-DA6)", () => {
  it("renders greeting, the family member row, and the brief", () => {
    render(<TodayView brief={brief} members={members} />);
    expect(screen.getByRole("heading", { name: /good morning/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Maya")).toBeInTheDocument();
    expect(screen.getByLabelText("Leo")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: /daily brief/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ask sam to drive/i })).toBeInTheDocument();
  });

  it("renders in dark theme", () => {
    render(<TodayView brief={brief} members={members} theme="dark" greeting="Good evening" />);
    expect(screen.getByRole("heading", { name: /good evening/i })).toBeInTheDocument();
  });
});
