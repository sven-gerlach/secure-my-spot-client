import React, { Component } from "react";

// import components
import PageTitle from "../../components/pageTitle/PageTitle"
import CustomButton from "../../components/button/CustomButton";

// import helper functions
import { signInRequest } from "../../httpRequests/auth";
import { getHashedPassword } from "../../utils/hash";
import { logUser } from "../../config/configLogRocket";
import messages from "../../utils/alertMessages";


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

  clearSignInForm = () => {
    this.setState({
      "email": "",
      "password": "",
    })
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
        this.clearSignInForm()

        // save user object (email and token) in App state and store user token in session storage
        this.props.setUser(response.data)

        // log user with LogRocket
        logUser(response.data)

        // redirect to /reserve
        this.props.history.push("/reserve")
      })
      // if authorisation fails...
      .catch(e => {
        this.props.enqueueNewAlert(...messages.failedSignIn)
        this.clearSignInForm()
        console.log(e);
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
              autoComplete="username"
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
              autoComplete="current-password"
              placeholder="Password"
              required
              value={this.state.password}
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

export default SignInView
