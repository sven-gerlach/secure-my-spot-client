import React from "react";
import {
  render,
} from "@testing-library/react";
import SignUpView from "./SignUp";

describe("SignUpView", () => {
  it("has two buttons", () => {
    const { container, queryAllByRole } = render(<SignUpView />)
    const buttons = queryAllByRole("button")
    expect(buttons).toHaveLength(2)
  })
  it("has three input fields", () => {
    const { container, queryAllByRole } = render(<SignUpView />)
    const inpuFields = queryAllByRole("textbox")
    expect(inpuFields).toHaveLength(3)
  })
})
