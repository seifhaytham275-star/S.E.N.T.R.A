import { describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import App from "./App";

describe("SENTRA MVP workspace", () => {
  it("renders the workspace and clearly reports demo mode", async () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /Think clearly/ })).toBeInTheDocument();
    expect(screen.getByText(/What would you like to work on/)).toBeInTheDocument();
    expect(await screen.findByText("DEMO MODE")).toBeInTheDocument();
    expect(screen.getByText(/Messages are saved locally/)).toBeInTheDocument();
    cleanup();
  });
});
