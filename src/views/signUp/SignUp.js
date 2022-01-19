// import libraries
import React, { Component } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";

// import containers
import PageTitle from "../../components/pageTitle/PageTitle";

// import helper functions
import { signUpRequest } from "../../httpRequests/auth";
import { getHashedPassword } from "../../utils/hash";
import { removeObjectFromStorage } from "../../utils/storage";
import { logUser } from "../../config/configLogRocket";
import messages from "../../utils/alertMessages";


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
      formValidated: false,
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

    const form = event.currentTarget;
    if (!form.checkValidity()) {
      event.stopPropagation()
      this.setState({formValidated: true})
    }
    else {
      const data = { ...this.state }

      // replace raw passwords with hashed passwords before sending them to the api
      data.password = data.password
        ? getHashedPassword(data.password)
        : ""
      data.passwordConfirmation = data.passwordConfirmation
        ? getHashedPassword(data.passwordConfirmation)
        : ""

      // call http request: /sign-up
      signUpRequest(data)
        .then(res => {
          // save user object (email and token) in App state and store user token in session storage
          this.props.setUser(res.data)

          // clear the local storage from any previous reservations (this is relevant if an unauthenticated user makes a
          // reservation followed by an authenticated user on the same device / client
          removeObjectFromStorage("reservation", "local")

          // log user with LogRocket
          logUser(res.data)

          // redirect to /reserve
          this.props.history.push("/reserve")

          // enqueue user alert
          this.props.enqueueNewAlert(...messages.successfulSignUp)
        })
        .catch(e => {
          if (e.response.status === 400) {
            this.props.enqueueNewAlert(
              "warning",
              "Oops...",
              Object.values(e.response.data)[0])
          }
          console.error(e)
        })
        .finally(() => {
          this.setState({
            "email": "",
            "password": "",
            "passwordConfirmation": "",
          })
        })
    }
  }

  render() {
    return (
      <>
        <PageTitle titleText="Create a New Account" />
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
            {/* note: the role attribute is required for the unit tests but will throw a warning in the browser console */}
            {/* eslint-disable-next-line */}
            <Form.Control
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="Password"
              required
              value={this.state.password}
              onChange={this.handleChange}
            />
            <Form.Control.Feedback type={"invalid"} >
              Enter a confidential password
            </Form.Control.Feedback>
          </FloatingLabel>
          <FloatingLabel label={"confirm password"} className={"mb-3"} >
            {/* note: the role attribute is required for the unit tests but will throw a warning in the browser console */}
            {/* eslint-disable-next-line */}
            <Form.Control
              type="password"
              name="passwordConfirmation"
              autoComplete="new-password"
              placeholder="Confirm Password"
              required
              value={this.state.passwordConfirmation}
              onChange={this.handleChange}
            />
            <Form.Control.Feedback type={"invalid"} >
              Confirm the confidential password
            </Form.Control.Feedback>
          </FloatingLabel>
          <Button type={"submit"} >Sign Up</Button>
        </Form>
      </>
    )
  }
}

export default SignUpView
