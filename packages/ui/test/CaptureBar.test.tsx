// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { CaptureBar, type CaptureKind } from "../src/CaptureBar.js";

afterEach(cleanup);

describe("CaptureBar (AC-DA9, AC-G3)", () => {
  it("offers snap/voice/paste/forward as accessible one-tap actions (no form)", () => {
    const captured: CaptureKind[] = [];
    render(<CaptureBar onCapture={(k) => captured.push(k)} />);

    for (const name of [/snap a photo/i, /speak/i, /paste/i, /forward/i]) {
      expect(screen.getByRole("button", { name })).toBeInTheDocument();
    }

    // each is a single gesture that starts capture immediately
    fireEvent.click(screen.getByRole("button", { name: /snap a photo/i }));
    fireEvent.click(screen.getByRole("button", { name: /speak/i }));
    expect(captured).toEqual(["photo", "voice"]);
    // no textbox / form fields exist on the capture surface
    expect(screen.queryByRole("textbox")).toBeNull();
  });
});
