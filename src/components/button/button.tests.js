import { render, screen } from "@testing-library/react";
import CustomButton from "./CustomButton";
import userEvent from "@testing-library/user-event";
import { createBrowserHistory } from "history";

// CustomButton feature of redirecting the user to a new path on the url has to be an integrated tested together with
// react-router. The best place for this is inside one of the views that make user of this button (e.g. Sign-In)

describe("button component", () => {
  it("renders a button with text", () => {
    render(<CustomButton buttonText="Click Me" />)
    const button = screen.getByRole("button")
    expect(button).toHaveTextContent("Click Me")
  })

  it("calls a handleSubmit function if button text is \"Submit\"", () => {
    const callBack = jest.fn()
    render(<CustomButton handleSubmit={callBack} buttonText="Submit" />)
    const button = screen.getByRole("button")
    userEvent.click(button)
    expect(callBack).toBeCalledTimes(1)
  })

  it("redirects to the route specified in props", () => {
    // create a history mock
    // source: https://github.com/remix-run/history/blob/main/docs/getting-started.md
    const history = createBrowserHistory()

    // create a mock push function
    // https://www.reddit.com/r/reactjs/comments/b1hsno/how_can_i_test_historypush_inside_action/
    const pushSpy = jest.spyOn(history, 'push');

    render(
      <CustomButton buttonText="Redirect Me" history={history} />
    )

    // assert that clicking the button leads to the mock pushSpy function have been called
    userEvent.click(screen.getByRole("button"))
    expect(pushSpy).toHaveBeenCalled()

    // restore the mocked function to its initial state
    pushSpy.mockRestore()
  })
})
