// import test libraries and react
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// history library lets us manage session history in JS
// https://www.npmjs.com/package/history
import { createBrowserHistory, createMemoryHistory } from "history";
import { BrowserRouter, Route, Router } from "react-router-dom";

// import component that needs testing
import Header from "./Header";

// https://stackoverflow.com/questions/43500235/jest-mock-a-function-called-inside-a-react-component
import { signOutRequest } from "../../httpRequests/auth";
jest.mock("../../httpRequests/auth")


describe("the header", () => {
  it("shows two links, namely \"Create Account\" and \"Sign-In\", for unauthenticated users", () => {
    const history = createMemoryHistory()

    const { getByText, queryAllByText } = render(
      <Router history={history}>
        <Header />
      </Router>
    )

    // find account link and click it
    userEvent.click(getByText("Account"))

    // get sign-in and create account links
    const createAccountLink = queryAllByText("Create Account")
    const signInLink = queryAllByText("Sign-In")

    // assertions
    expect(createAccountLink).toHaveLength(1)
    expect(signInLink).toHaveLength(1)
  })

  describe("for an authenticated user", () => {
    describe("clicking the sign-out button will", () => {
      test("invoke the axios delete request", async () => {
        signOutRequest.mockImplementation(() => Promise.resolve())

        // create browser history object which features a push method
        const historyMock = createBrowserHistory()

        // create a mock function that spies on the history object and the push method
        const spyOnHistory = jest.spyOn(historyMock, "push")

        // mock a user object
        const userMock = {
          email: "mock@mail.com",
          token: "123456789ABCDEF"
        }

        // mock a setUser function
        const setUserMock = jest.fn()

        // mock the enqueueNewAlert function
        const enqueueNewAlertMock = jest.fn()

        // render the header
        render(
          <BrowserRouter>
            <Header
              history={historyMock}
              user={userMock}
              setUser={setUserMock}
              enqueueNewAlert={enqueueNewAlertMock}
            />
            <Route path="/" render={() => <h1>This result only shows if redirection was successful</h1>} />
          </BrowserRouter>
        )
        userEvent.click(screen.getByText("Account"))
        userEvent.click(screen.getByText("Sign-Out"))

        // click on account followed by clicking on sign-out link
        await waitFor(() => {
          expect(setUserMock).toHaveBeenCalledTimes(1)
          expect(enqueueNewAlertMock).toHaveBeenCalledTimes(1)
          expect(screen.getByText(/redirection was successful/)).toBeInTheDocument()
        })
      })
    })
  })
})
