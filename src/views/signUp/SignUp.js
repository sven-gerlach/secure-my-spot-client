// import libraries
import React, { Component } from "react";

// import containers
import PageTitle from "../../components/pageTitle/PageTitle";
import CustomButton from "../../components/button/CustomButton";

// import helper functions
import { signUpRequest } from "../../httpRequests/auth";
import { getHashedPassword } from "../../utils/hash";


/** Class representing the create account view
 * */
class SignUpView extends Component {
  constructor(props) {
    super(props);
    // state-names may contravene JS camel-case but are in-line with json expected by the back-end route /sign-up
    this.state = {
      email: "",
      password: "",
      passwordConfirmation: "",
    }
  }

  handleChange = (event) => {
    const stateName = event.target.name
    const stateValue = event.target.value
    this.setState({
      [stateName]: stateValue
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const data = { ...this.state }

    // replace raw passwords with hashed passwords before sending them to the api
    data.password = data.password
      ? getHashedPassword(data.password)
      : ""
    data.passwordConfirmation = data.passwordConfirmation
      ? getHashedPassword(data.passwordConfirmation)
      : ""

    // call http request: /sign-up
    // todo: consider having the api issue tokens for newly signed up users automatically
    signUpRequest(data)
      .then(response => {})
      .catch(error => {})
      .finally(() => {
        this.setState({
          "email": "",
          "password": "",
          "passwordConfirmation": "",
        })
      })
  }

  render() {
    return (
      <>
        <PageTitle titleText="Create Account" />
        <form>
          <div>
            <input
              type="email"
              name="email"
              autoComplete="username"
              placeholder="e-Mail"
              required
              autoFocus
              value={this.state.email}
              onChange={this.handleChange}
            />
          </div>
          <div>
            {/* note: the role attribute is required for the unit tests but will throw a warning in the browser console */}
            {/* eslint-disable-next-line */}
            <input
              role="textbox"
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="Password"
              required
              value={this.state.password}
              onChange={this.handleChange}
            />
          </div>
          <div>
            {/* note: the role attribute is required for the unit tests but will throw a warning in the browser console */}
            {/* eslint-disable-next-line */}
            <input
              role="textbox"
              type="password"
              name="passwordConfirmation"
              autoComplete="new-password"
              placeholder="Confirm Password"
              required
              value={this.state.passwordConfirmation}
              onChange={this.handleChange}
            />
          </div>
          <CustomButton
            buttonText="Submit"
            handleSubmit={this.handleSubmit}
          />
        </form>
        <CustomButton
          {...this.props}
          buttonText="Back"
          urlTarget="/"
        />
      </>
    )
  }
}

export default SignUpView
