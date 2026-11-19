import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";

const TestConsumer = () => {
  const { user, role, success } = useAuth();
  return (
    <div>
      <span data-testid="user">{user || "guest"}</span>
      <span data-testid="role">{role || "none"}</span>
      <span data-testid="success">{success ? "logged_in" : "logged_out"}</span>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should provide default empty state when not logged in", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId("user")).toHaveTextContent("guest");
    expect(screen.getByTestId("role")).toHaveTextContent("none");
    expect(screen.getByTestId("success")).toHaveTextContent("logged_out");
  });

  it("should provide stored credentials from localStorage", () => {
    localStorage.setItem("user", "testadmin");
    localStorage.setItem("role", "admin");
    localStorage.setItem("success", "true");

    render(
      <MemoryRouter>
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId("user")).toHaveTextContent("testadmin");
    expect(screen.getByTestId("role")).toHaveTextContent("admin");
    expect(screen.getByTestId("success")).toHaveTextContent("logged_in");
  });
});

