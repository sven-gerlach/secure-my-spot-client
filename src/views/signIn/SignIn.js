import React, { Component } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";

// import components
import PageTitle from "../../components/pageTitle/PageTitle"

// import helper functions
import { signInRequest } from "../../httpRequests/auth";
import { getHashedPassword } from "../../utils/hash";
import messages from "../../utils/alertMessages";
import { removeObjectFromStorage } from "../../utils/storage";


/**
 * Class for the sign-in view. Allows users to enter their email and password. It actions a http request to the api
 * which returns a token. The class needs to store the unique email and the associated token temporarily.
 */
class SignInView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      formValidated: false,
    }
  }

  clearSignInForm = () => {
    this.setState({
      email: "",
      password: "",
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
    event.preventDefault()

    const form = event.currentTarget;
    if (!form.checkValidity()) {
      event.stopPropagation()
      this.setState({formValidated: true})
    }
    else {
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

          // clear the local storage from any previous reservations (this is relevant if an unauthenticated user makes a
          // reservation followed by an authenticated user on the same device / client
          removeObjectFromStorage("reservation", "local")

          // redirect to /reserve
          this.props.history.push("/reserve")

          // enqueue success message
          this.props.enqueueNewAlert(...messages.successfulSignIn)
        })
        // if authorisation fails...
        .catch(e => {
          this.props.enqueueNewAlert(...messages.failedSignIn)
          this.clearSignInForm()
          console.error(e)
        })
    }

  }

  render() {
    return (
      <>
        <PageTitle titleText="Sign-In" />
        <Form noValidate validated={this.state.formValidated} onSubmit={this.handleSubmit}>
          <FloatingLabel label={"e-Mail"} className={"mb-3"} >
            <Form.Control
              type="email"
              name="email"
              autoComplete="username"
              placeholder="e-Mail"
              required
              autoFocus
              value={this.state.email}
              onChange={this.handleChange}
            />
            <Form.Control.Feedback type={"invalid"} >
              Enter a valid e-Mail
            </Form.Control.Feedback>
          </FloatingLabel>
          <FloatingLabel label={"password"} className={"mb-3"} >
            <Form.Control
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Password"
              required
              value={this.state.password}
              onChange={this.handleChange}
            />
            <Form.Control.Feedback type={"invalid"} >
              Enter your confidential password
            </Form.Control.Feedback>
          </FloatingLabel>
          <Button type={"submit"} >Submit</Button>
        </Form>
      </>
    )
  }
}

export default SignInView
