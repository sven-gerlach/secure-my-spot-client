// import test libraries and react
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// history library lets us manage session history in JS
// https://www.npmjs.com/package/history
import { createMemoryHistory } from 'history'
import { BrowserRouter, Router } from "react-router-dom";

// import component that needs testing
import Header from "./Header";
import App from "../../views/App";

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
})
