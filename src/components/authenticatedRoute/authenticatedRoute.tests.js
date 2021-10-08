import { render, screen } from "@testing-library/react";
import { BrowserRouter, Route } from "react-router-dom";
import AuthenticatedRoute from "./AuthenticatedRoute";

describe("Authenticated route", () => {
  const mockUser = {
    email: "mock@email.com",
    token: "123456789ABCDEF"
  }

  const MockComponent = ({ ...props }) => (
    <>
      <h1>{props.heading}</h1>
      <p>{props.text}</p>
    </>
  )

  it("redirects to the landing page", () => {
    render(
      <BrowserRouter>
        <AuthenticatedRoute />
        <Route path="/">
          <p>Correct Route</p>
        </Route>
        <Route path="/incorrect-route">
          <p>Incorrect Route</p>
        </Route>
      </BrowserRouter>
    )

    // Assert that the redirection to correct route works but not to incorrect route
    expect(screen.queryByText("Correct Route")).toBeInTheDocument()
    expect(screen.queryByText("Incorrect Route")).toBeNull()
  })

  it("returns the component provided to the HOC via the component props", () => {

    render(
      <BrowserRouter>
        <AuthenticatedRoute user={mockUser} component={<MockComponent heading="My Heading" text="Some random text" />} />
      </BrowserRouter>
    )

    expect(screen.getByText("My Heading")).toBeInTheDocument()
    expect(screen.getByText("Some random text")).toBeInTheDocument()
  })

  it("returns the component provided to the HOC via the render method", () => {
    const mockProps = {
      heading: "Your Heading",
      text: "Another random text"
    }

    render(
      <BrowserRouter>
        <AuthenticatedRoute user={mockUser} render={() => <MockComponent {...mockProps} />} />
      </BrowserRouter>
    )

    expect(screen.getByText(mockProps.heading)).toBeInTheDocument()
    expect(screen.getByText(mockProps.text)).toBeInTheDocument()
  })
})
