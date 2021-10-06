// import libraries
import React, { Component } from "react";

// import containers
import PageTitle from "../../components/pageTitle/PageTitle";
import Button from "../../components/button/Button";

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

    // replace raw passwords with hashed passwords
    data.password = data.password
      ? getHashedPassword(data.password)
      : ""
    data.passwordConfirmation = data.passwordConfirmation
      ? getHashedPassword(data.passwordConfirmation)
      : ""

    // call http request: /sign-up
    // todo: consider having the api issue tokens for newly signed up users automatically
    signUpRequest(data)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error)
      })
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
              placeholder="e-Mail"
              required
              autoFocus
              value={this.state.email}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={this.state.password}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <input
              type="password"
              name="passwordConfirmation"
              placeholder="Confirm Password"
              required
              value={this.state.passwordConfirmation}
              onChange={this.handleChange}
            />
          </div>
          <Button
            buttonText="Submit"
            handleSubmit={this.handleSubmit}
          />
        </form>
        <Button
          buttonText="Back"
          urlTarget="/"
        />
      </>
    )
  }
}

export default SignUpView
