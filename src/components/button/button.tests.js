import { render, screen } from "@testing-library/react";
import Button from "./Button";
import userEvent from "@testing-library/user-event";

// Button feature of redirecting the user to a new path on the url has to be an integrated tested together with
// react-router. The best place for this is inside one of the views that make user of this button (e.g. Sign-In)

describe("button component", () => {
  it("renders a button with text", () => {
    render(<Button buttonText="Click Me" />)
    const button = screen.getByRole("button")
    expect(button).toHaveTextContent("Click Me")
  })
  it("calls a handleSubmit function if button text is \"Submit\"", () => {
    const callBack = jest.fn()
    render(<Button handleSubmit={callBack} buttonText="Submit" />)
    const button = screen.getByRole("button")
    userEvent.click(button)
    expect(callBack).toBeCalledTimes(1)
  })
})
