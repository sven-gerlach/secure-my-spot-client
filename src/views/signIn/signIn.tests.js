/**
 * Test SignIn components
 */

// import testing modules
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { createBrowserHistory } from "history";

// import components
import SignIn from "./SignIn";

// import utils
import { signInRequest } from "../../httpRequests/auth";

// mock http request module
jest.mock("../../httpRequests/auth")

describe("sign-in view", () => {
  describe("typing in the input fields", () => {
    test("changes the field values", () => {
      render(<SignIn />)

      userEvent.type(screen.getByPlaceholderText("e-Mail"), "sample@email.com")
      userEvent.type(screen.getByPlaceholderText("Password"), "some password")

      // make assertions
      expect(screen.getByPlaceholderText("e-Mail")).toHaveDisplayValue("sample@email.com")
      expect(screen.getByPlaceholderText("Password")).toHaveDisplayValue("some password")
    })
  })

  describe("click submit button", () => {
    // mock the setUser method here so it is accessible from within the tests
    const setUserMock = jest.fn().mockName("setUser")

    // create browser history object which features a push method
    const historyMock = createBrowserHistory()

    beforeEach(() => {
      signInRequest.mockImplementation((data) => {
        return Promise.resolve({
          email: "svengerlach@me.com",
          token: "b5ce419f2ee683236582fff557291b96fabc6432"
        })
      })

      const enqueueNewAlertMock = jest.fn()

      // render signIn with setUserMock
      render(
        <BrowserRouter>
          <SignIn
            setUser={setUserMock}
            history={historyMock}
            enqueueNewAlert={enqueueNewAlertMock}
          />
          <Route path="/reserve" render={() => <p>reservations</p>} />
        </BrowserRouter>
      )

      userEvent.type(screen.getByPlaceholderText("e-Mail"), "svengerlach@me.com")
      userEvent.type(screen.getByPlaceholderText("Password"), "mockPassword")
      userEvent.click(screen.getByText("Submit"))
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    test("invoke signInRequest function", async () => {
      // type email and password into input elements and click submit button
      await waitFor(() => {
        expect(signInRequest).toHaveBeenCalled()
      })
    })

    test("invoke setUser method and set state with user details", async () => {
      await waitFor(() => {
        expect(setUserMock).toHaveBeenCalled()
      })
    })

    test("redirect user to /reserve path", async () => {
      await waitFor(() => {
        expect(screen.getByText("reservations")).toBeInTheDocument()
      })
    })

    test("reset input field values to empty string",() => {
      // click submit button
      userEvent.click(screen.getByRole("button", { name: "Submit" }))

      // assert that all three input fields have display value of ""
      expect(screen.getByPlaceholderText("e-Mail")).toHaveDisplayValue("")
      expect(screen.getByPlaceholderText("Password")).toHaveDisplayValue("")
    })
  })
})
