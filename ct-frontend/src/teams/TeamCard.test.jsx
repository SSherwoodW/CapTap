import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TeamCard from "./TeamCard";

describe("TeamCard component", () => {
  it("should render without crashing", () => {
    render(
      <MemoryRouter>
        <TeamCard name="Test Name" code="test" />
      </MemoryRouter>
    );
  });

  it("should match snapshot", () => {
    const { container } = render(
      <MemoryRouter>
        <TeamCard name="Test Name" code="test" />
      </MemoryRouter>
    );
    expect(container).toMatchSnapshot();
  });
});