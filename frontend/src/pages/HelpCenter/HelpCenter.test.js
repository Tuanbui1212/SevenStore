import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HelpCenter from "./index";

describe("HelpCenter Component", () => {
  it("should render help center title and support topics", () => {
    render(
      <MemoryRouter>
        <HelpCenter />
      </MemoryRouter>
    );

    expect(screen.getByText("GET HELP")).toBeInTheDocument();
    expect(screen.getByText("Shipping & Delivery")).toBeInTheDocument();
    expect(screen.getByText("Size Charts")).toBeInTheDocument();
    expect(screen.getByText("My Account")).toBeInTheDocument();
  });

  it("should toggle FAQ questions and answers when clicked", () => {
    render(
      <MemoryRouter>
        <HelpCenter />
      </MemoryRouter>
    );

    const question = screen.getByText("Where is my order?");
    expect(question).toBeInTheDocument();

    // Click to open
    fireEvent.click(question);
    expect(screen.getByText(/You can check the status of your order/i)).toBeInTheDocument();
  });
});

