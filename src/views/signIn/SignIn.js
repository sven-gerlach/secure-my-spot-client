import React, { Component } from "react";

// import components
import PageTitle from "../../components/pageTitle/PageTitle"
import Button from "../../components/button/Button";

// import helper functions
import { signInRequest } from "../../httpRequests/auth";
import { getHashedPassword } from "../../utils/hash";
import { logUser } from "../../config/configLogRocket";

/**
 * Class for the sign-in view. Allows users to enter their email and password. It actions a http request to the api
 * which returns a token. The class needs to store the unique email and the associated token temporarily.
 */
class SignInView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "email": "",
      "password": "",
    }
  }

  handleChange = (event) => {
    const stateName = event.target.name
    const stateValue = event.target.value
    this.setState({
      [stateName]: stateValue,
    })
  }

  handleSubmit = (event) => {
    const data = { ...this.state }

    // replace password with a hashed password
    data.password = data.password
      ? getHashedPassword(data.password)
      : ""

    // make a http request to the api with email and password
    signInRequest(data)
      // if authorisation is successful store the returned token in a JS object
      .then(response => {
        // clear state of sign-in form
        this.setState({
          "email": "",
          "password": "",
        })

        // todo: change from session to local storage to make sessions survive closed windows
        // todo: refactor session / local storage out of setUser method into a standalone component / function so it can be used for storing other things too (e.g. reserved but not yet paid for parking spot)
        // save user object (email and token) in App state and store user token in session storage
        this.props.setUser(response.data)

        // log user with LogRocket
        logUser(response.data)

        // redirect to /reserve
        this.props.history.push("/reserve")
      })
      // if authorisation fails...
      // todo: set up meaningful alert system that can be flexibly used for all user alerts / infos
      .catch(e => console.log(e))
  }

  render() {
    return (
      <>
        <PageTitle titleText="Sign-In" />
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
          <Button
            buttonText="Submit"
            handleSubmit={this.handleSubmit}
          />
        </form>
        <Button
          {...this.props}
          buttonText="Back"
          urlTarget="/"
        />
      </>
    )
  }
}

export default SignInView
