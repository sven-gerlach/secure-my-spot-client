import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, Route } from "react-router-dom";
import SignIn from "./SignIn";
import userEvent from "@testing-library/user-event";

// import and mock signInRequest
import { signInRequest } from "../../httpRequests/auth";
import { createBrowserHistory } from "history";
jest.mock("../../httpRequests/auth")

describe("sign-in view", () => {
  describe("if back button is clicked", () => {
    test("user is sent back to main page", () => {
      // mock setUser function
      const setUserMock = jest.fn()

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
  describe("click submit button", () => {
    // mock the setUser method here so it is accessible from within the tests
    const setUserMock = jest.fn()

    // create browser history object which features a push method
    const historyMock = createBrowserHistory()

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
          <Route path="/reserve" render={() => <p>Make reservations here</p>} />
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
        expect(screen.getByText("Make reservations here")).toBeInTheDocument()
      })
    })
  })
})
