import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App Root Component", () => {
  it("renders without crashing and displays header elements", () => {
    render(<App />);
    const logos = screen.getAllByText("SEVENSTORE");
    expect(logos.length).toBeGreaterThanOrEqual(1);
  });
});
