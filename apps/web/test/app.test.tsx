// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { App } from "../src/main.js";

afterEach(cleanup);

describe("web app — navigation across all screens", () => {
  it("Today, Co-pilot (goal→plan→approve→Activity), Settings all work", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /good morning/i })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /approve/i }).length).toBeGreaterThanOrEqual(2);

    fireEvent.click(screen.getByRole("button", { name: /co-pilot/i }));
    expect(screen.getByLabelText(/what do you need sorted/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /sort out leo's birthday/i }));
    expect(screen.getByRole("button", { name: /approve this plan/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /approve this plan/i }));
    expect(screen.getByRole("heading", { name: /^activity$/i })).toBeInTheDocument();
    expect(screen.getByText(/started plan for/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^settings$/i }));
    expect(screen.getAllByRole("radio").length).toBeGreaterThanOrEqual(4);
  });
});

describe("web app — capture flow (real extraction, on-device fallback)", () => {
  beforeEach(() => vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("no route"))));

  it("paste → extract → file shows on Today and logs to Activity", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /snap a photo/i }));
    fireEvent.change(screen.getByLabelText(/paste or type what you captured/i), {
      target: { value: "Leo swim Thursday at 5pm at Aquatic Centre" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^capture$/i }));

    expect(await screen.findByText(/I found this/i)).toBeInTheDocument();
    expect(screen.getByText(/Leo swim/)).toBeInTheDocument();
    expect(screen.getByText(/Aquatic Centre/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /file it/i }));
    await waitFor(() => expect(screen.getByText(/just added/i)).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: /^activity$/i }));
    expect(screen.getByText(/Filed:/i)).toBeInTheDocument();
  });
});
