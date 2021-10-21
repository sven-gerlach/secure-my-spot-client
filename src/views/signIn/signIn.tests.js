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
import { logUser } from "../../config/configLogRocket";

// mock http request module
jest.mock("../../httpRequests/auth")

// mock configLogRocket module in order to mock the logUser function
// https://stackoverflow.com/questions/43500235/jest-mock-a-function-called-inside-a-react-component
jest.mock("../../config/configLogRocket", () => ({ logUser: jest.fn() }))


describe("sign-in view", () => {
  describe("if back button is clicked", () => {
    test("user is sent back to main page", () => {
      // mock setUser function
      const setUserMock = jest.fn().mockName("setUser")

      render(
        <BrowserRouter>
          <Route render={(props) => (
            <SignIn {...props} setUser={setUserMock} />
          )}/>
          <Route path="/" render={() => <p>a new page</p>} />
        </BrowserRouter>
      )

      // assert that clicking the back button will redirect to the main page
      userEvent.click(screen.getByText("Back"))
      expect(screen.getByText("a new page")).toBeInTheDocument()
    })
  })

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

    // mock logUser method since original function in configLogRocket module doesn't work since logRocket is not
    // initialised during the test phase. LogRocket must not be initialised since it makes XMLHTTPRequest calls, a
    // library that only exists inside the browser environment
    logUser.mockImplementation(() => true)

    beforeEach(() => {
      signInRequest.mockImplementation((data) => {
        return Promise.resolve({
          email: "svengerlach@me.com",
          token: "b5ce419f2ee683236582fff557291b96fabc6432"
        })
      })

      // render signIn with setUserMock
      render(
        <BrowserRouter>
          <SignIn setUser={setUserMock} history={historyMock} />
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
        expect(logUser).toHaveBeenCalled()
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
