import { describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import App from "./App";

describe("SENTRA MVP workspace", () => {
  it("renders the workspace and clearly reports demo mode", () => {
    render(<App />);
    expect(screen.getByText("Think clearly.")).toBeInTheDocument();
    expect(screen.getByText("DEMO MODE")).toBeInTheDocument();
    expect(screen.getByText(/Messages are saved locally/)).toBeInTheDocument();
    cleanup();
  });
});
