import React, { Component } from "react";

// import components
import PageTitle from "../../../components/pageTitle/PageTitle"
import Button from "../../../components/button/Button";

// import helper functions
import { signIn } from "../../../httpRequests/auth";
import getHashedPassword from "../../../utils/hash/hash";

/**
 * Class for the sign-in view. Allows users to enter their email and password. It actions a http request to the api
 * which returns a token. The class needs to store the unique email and the associated token temporarily.
 */
class SignIn extends Component {
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
    signIn(data)
      // if authorisation is successful store the returned token in a JS object
      // todo: consider storing the token in session storage or in a cookie instead as that would make the cookie survive
      //  browser sessions and avoid the user having to sign-in every time they go to the client website
      .then(response => {
        // save user object (email and token) in App state
        this.props.setUser(response.data)
      })
      // if authorisation fails...
      // todo: set up meaningful alert system that can be flexibly used for all user alerts / infos
      .catch(error => {
        console.log(error.response)
      })
      .finally(() => {
        this.setState({
          "email": "",
          "password": "",
        })
      })
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
          buttonText="Back"
          urlTarget="/"
        />
      </>
    )
  }
}

export default SignIn
