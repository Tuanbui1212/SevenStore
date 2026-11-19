import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "./index";

describe("Pagination Component", () => {
  it("should not render when totalPages is 1 or less", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("should render page buttons when totalPages > 1", () => {
    render(
      <Pagination currentPage={1} totalPages={4} onPageChange={() => {}} />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("should trigger onPageChange when clicking a page number", () => {
    const handleChange = typeof jest !== "undefined" ? jest.fn() : vi.fn();
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={handleChange} />
    );

    fireEvent.click(screen.getByText("3"));
    expect(handleChange).toHaveBeenCalledWith(3);
  });

  it("should disable previous arrow on first page", () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
    );

    const prevButton = screen.getByLabelText("Previous page");
    expect(prevButton).toBeDisabled();
  });

  it("should enable next and previous arrows when on middle page", () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />
    );

    expect(screen.getByLabelText("Previous page")).not.toBeDisabled();
    expect(screen.getByLabelText("Next page")).not.toBeDisabled();
  });
});
