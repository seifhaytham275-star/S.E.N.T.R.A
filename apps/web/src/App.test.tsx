import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("SENTRA workspace", () => {
  it("renders the initial assistant workspace without claiming a live AI connection", () => {
    render(<App />);
    expect(screen.getByText("Your ideas.")).toBeInTheDocument();
    expect(screen.getByText("CORE OFFLINE")).toBeInTheDocument();
    expect(screen.getByText("AI connection is not configured yet. Messages are not sent.")).toBeInTheDocument();
  });
});
