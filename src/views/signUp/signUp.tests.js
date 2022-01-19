import React from "react";
import {
  render,
  screen
} from "@testing-library/react";
import SignUpView from "./SignUp";
import { signUpRequest } from "../../httpRequests/auth";
import { BrowserRouter, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { createBrowserHistory } from "history";

// mock the auth module
jest.mock("../../httpRequests/auth")

//reset all mock functions at the end of the test suite
afterAll(() => {
  jest.clearAllMocks()
})

describe("SignUpView", () => {
  beforeEach(() => {
    // assign a mock function to signUpRequest, returning a resolved promise
    // https://www.robinwieruch.de/axios-jest/
    signUpRequest.mockImplementation(() => Promise.resolve({ data: { email: "sample@email.com", token: "a_secure_token" } })).mockName("signUpRequest")

    // mock browser history
    const historyMock = createBrowserHistory()

    // mock enqueueNewAlert function
    const enqueueNewAlertMock = jest.fn()

    // mock setNewUser function
    const setUserMock = jest.fn()

    // render the SignUpView
    render(
      <BrowserRouter>
        <Route render={() => (
          <SignUpView
            history={historyMock}
            setUser={setUserMock}
            enqueueNewAlert={enqueueNewAlertMock}
          />
        )} />
        <Route
          path="/"
          render={() => <p>will be rendered</p>}
        />
        <Route
          path="/invalid-route"
          render={() => <p>will not be rendered</p>}
        />
      </BrowserRouter>
    )
  })

  // clear all mock functions after each test
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("typing in the input fields", () => {
    test("changes the input field values to the typed string", () => {
      // type something into all three input fields
      userEvent.type(screen.getByPlaceholderText("e-Mail"), "sample@email.com")
      userEvent.type(screen.getByPlaceholderText("Password"), "some password")
      userEvent.type(screen.getByPlaceholderText("Confirm Password"), "some password")

      // assert that field values equate typed values
      expect(screen.getByPlaceholderText("e-Mail")).toHaveDisplayValue("sample@email.com")
      expect(screen.getByPlaceholderText("Password")).toHaveDisplayValue("some password")
      expect(screen.getByPlaceholderText("Confirm Password")).toHaveDisplayValue("some password")
    })
  })

  describe("click submit button", () => {
    test("call signUpRequest function", () => {
      // type valid inputs into all three input fields
      userEvent.type(screen.getByPlaceholderText("e-Mail"), "sample@email.com")
      userEvent.type(screen.getByPlaceholderText("Password"), "some password")
      userEvent.type(screen.getByPlaceholderText("Confirm Password"), "some password")

      // click submit button
      userEvent.click(screen.getByRole("button", { name: "Sign Up" }))

      // assert that mock implementation of signUpRequest has been called
      expect(signUpRequest).toHaveBeenCalled()
    })

    test("reset input field values to empty string",() => {
      // click submit button
      userEvent.click(screen.getByRole("button", { name: "Sign Up" }))

      // assert that all three input fields have display value of ""
      expect(screen.getByPlaceholderText("e-Mail")).toHaveDisplayValue("")
      expect(screen.getByPlaceholderText("Password")).toHaveDisplayValue("")
      expect(screen.getByPlaceholderText("Confirm Password")).toHaveDisplayValue("")
    })
  })
})
