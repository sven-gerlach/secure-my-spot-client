// import test libraries and react
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { BrowserRouter } from "react-router-dom";

// import component that needs testing
import App from "./App";


describe("the Header", () => {
  it("shows the Create Account page if clicked", () => {
    // const history = createMemoryHistory()

    const { getByText } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    // find account link and click it
    userEvent.click(getByText("Account"))

    // click on Create Account button
    userEvent.click(getByText("Create Account"), {button: 0})

    // assert link forwarding works
    expect(screen.getByRole("heading")).toHaveTextContent("Create Account")
  })

  it("shows the Sign-In page if clicked", () => {
    // const history = createMemoryHistory()

    const { getByText } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    // find account link and click it
    userEvent.click(getByText("Account"))

    // click on Create Account button
    userEvent.click(getByText("Sign-In"), {button: 0})

    // assert link forwarding works
    expect(screen.getByRole("heading")).toHaveTextContent("Sign-In")
  })
})

describe("the header on small screens", () => {
  // current viewport width
  let viewPortWidth = window.innerWidth

  // change viewport width to ensure navbar is collapsed
  beforeAll(() => {
    Object.assign(window, { innerWidth: 300 });
    global.dispatchEvent(new Event("resize"));
  })

  // change viewport width back to its original state
  afterAll(() => {
    Object.assign(window, { innerWidth: viewPortWidth });
    global.dispatchEvent(new Event("resize"));
  })

  it("displays a toggle button in the top right corner", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    const toggleButton = screen.getByRole("button", {name: "Toggle navigation"})
    expect(toggleButton).toBeInTheDocument()
  })

  it("clicking the toggle button will expand the header", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    // assert that navbar is collapsed
    const toggleButton = screen.getByRole("button", {name: "Toggle navigation"})
    expect(toggleButton.classList.contains("collapsed")).toBe(true)

    // assert that clicking on toggle button displays navbar
    userEvent.click(toggleButton)
    expect(toggleButton.classList.contains("collapsed")).toBe(false)

    // assert that clicking on home link collapses navbar
    userEvent.click(screen.getByRole("link", {name: "Home"}))
    expect(toggleButton.classList.contains("collapsed")).toBe(true)

    // assert that clicking on toggle button followed by clicking on header results in collapsed navbar
    userEvent.click(toggleButton)
    expect(toggleButton.classList.contains("collapsed")).toBe(false)
    userEvent.click(screen.getByText(/Our Service/))
    expect(toggleButton.classList.contains("collapsed")).toBe(true)
  })
})
