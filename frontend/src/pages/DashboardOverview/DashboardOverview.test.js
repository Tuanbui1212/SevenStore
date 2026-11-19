import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DashboardOverview from "./index";

describe("DashboardOverview Component", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("user", "testadmin");
    localStorage.setItem("role", "admin");
  });

  it("should render welcome banner with username", () => {
    render(
      <MemoryRouter>
        <DashboardOverview />
      </MemoryRouter>
    );

    expect(screen.getByText(/Welcome back, testadmin!/i)).toBeInTheDocument();
  });

  it("should render metric cards for revenue, orders, products, customers", () => {
    render(
      <MemoryRouter>
        <DashboardOverview />
      </MemoryRouter>
    );

    expect(screen.getByText("Total Revenue")).toBeInTheDocument();
    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Customers")).toBeInTheDocument();
  });

  it("should render quick action buttons", () => {
    render(
      <MemoryRouter>
        <DashboardOverview />
      </MemoryRouter>
    );

    expect(screen.getByText("Add New Product")).toBeInTheDocument();
    expect(screen.getByText("Process Orders")).toBeInTheDocument();
    expect(screen.getByText("Manage Inventory")).toBeInTheDocument();
    expect(screen.getByText("Customer Directory")).toBeInTheDocument();
    expect(screen.getByText("Financial Report")).toBeInTheDocument();
  });
});

