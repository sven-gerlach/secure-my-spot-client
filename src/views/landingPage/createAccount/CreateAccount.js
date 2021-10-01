// import libraries
import React, { Component } from "react";

// import containers
import PageTitle from "../../../components/pageTitle/PageTitle";
import Button from "../../../components/button/Button";

// import helper functions
import signUp from "../../../httpRequests/sign-up";
import getHashedPassword from "../../../utils/hash/hash";

/** Class representing the create account view
 * */
class CreateAccount extends Component {
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
    const target = event.target
    const stateProperty = target.name
    const value = target.value
    this.setState({
      [stateProperty]: value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const data = this.state

    // replace raw passwords with hashed passwords
    data.password = data.password
      ? getHashedPassword(data.password)
      : ""
    data.passwordConfirmation = data.passwordConfirmation
      ? getHashedPassword(data.passwordConfirmation)
      : ""

    // call http request: /sign-up
    signUp(data)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error)
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

export default CreateAccount
