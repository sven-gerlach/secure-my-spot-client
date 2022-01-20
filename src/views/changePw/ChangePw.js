import React, { Component } from "react";
import PageTitle from "../../components/pageTitle/PageTitle";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { sendChangePasswordRequest } from "../../httpRequests/auth";
import messages from "../../utils/alertMessages";
import { getHashedPassword } from "../../utils/hash";


export default class ChangePwView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      formValidated: false,
      newPasswordIsInvalid: false,
      confirmNewPasswordIsInvalid: false,
      newPasswordFeedback: "Enter the new password",
      confirmNewPasswordFeedback: "Enter the new password again to confirm"
    }
  }

  handleChange = (e) => {
    const stateName = e.target.name
    const stateValue = e.target.value
    // set state
    this.setState({
      [stateName]: stateValue
    })
    // check validity
    this.checkFieldValidity(stateName, stateValue)
  }

  checkFieldValidity = (inputName, inputValue) => {
    // eslint-disable-next-line default-case
    switch (inputName) {
      case "newPassword":
        if (inputValue === this.state.oldPassword && this.state.formValidated) {
          this.setState({
            newPasswordIsInvalid: true,
            newPasswordFeedback: "The new password must not be the same as the current password",
          })
        }
        else {
          this.setState({
            newPasswordIsInvalid: false,
            newPasswordFeedback: "Enter the new password",
          })
        }
        break
      case "confirmNewPassword":
        if (inputValue !== this.state.newPassword && this.state.formValidated) {
          this.setState({
            confirmNewPasswordIsInvalid: true,
            confirmNewPasswordFeedback: "The new password does not match the confirmed password",
          })
        }
        else {
          this.setState({
            confirmNewPasswordIsInvalid: false,
            confirmNewPasswordFeedback: "Enter the new password again to confirm",
          })
        }
        break
    }
  }

  handleSubmit = (e) => {
    // reset validation status and feedback for all input fields
    this.setState({
      newPasswordIsInvalid: false,
      confirmNewPasswordIsInvalid: false,
      newPasswordFeedback: "Enter the new password",
      confirmNewPasswordFeedback: "Enter the new password again to confirm",
      formValidated: false,
    })

    e.preventDefault()

    const {oldPassword, newPassword, confirmNewPassword} = this.state
    let isFormSafeToSend = true

    // check that all fields are validated
    const form = e.currentTarget
    if (!form.checkValidity()) {
      e.stopPropagation()
      isFormSafeToSend = false
      this.setState({ formValidated: true })
    }
    if (oldPassword === newPassword) {
      e.stopPropagation()
      isFormSafeToSend = false
      this.setState({
        newPasswordIsInvalid: true,
        newPasswordFeedback: "The new password must not be the same as the current password",
        formValidated: true
      })
    }
    if (newPassword !== confirmNewPassword) {
      e.stopPropagation()
      isFormSafeToSend = false
      this.setState({
        confirmNewPasswordIsInvalid: true,
        confirmNewPasswordFeedback: "The new password does not match the confirmed password",
        formValidated: true
      })
    }

    if (isFormSafeToSend) {
      const currentHashedPassword = getHashedPassword(oldPassword)
      const newHashedPassword = getHashedPassword(newPassword)
      const confirmNewHashedPassword = getHashedPassword(confirmNewPassword)
      const data = {
        "credentials": {
          "email": this.props.user.email,
          "password": currentHashedPassword,
          "new_password": newHashedPassword,
          "new_password_confirmed": confirmNewHashedPassword,
        }
      }

      sendChangePasswordRequest(this.props.user.token, data)
        .then(res => {
          this.props.enqueueNewAlert(...messages.successfulChangePassword)
          this.setState({
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          })
        })
        .catch(e => this.props.enqueueNewAlert(...messages.failedChangePassword))
    }
  }

  render() {
    return (
      <>
        <PageTitle titleText="Change Your Password" />
        <Form noValidate validated={this.state.formValidated} onSubmit={this.handleSubmit}>
          <FloatingLabel label={"old password"} className={"mb-3"} >
            <Form.Control
              type="password"
              name="oldPassword"
              placeholder="old password"
              required
              autoFocus
              autoComplete="current-password"
              value={this.state.oldPassword}
              onChange={this.handleChange}
            />
            <Form.Control.Feedback type={"invalid"} >
              Enter your current password
            </Form.Control.Feedback>
          </FloatingLabel>
          <FloatingLabel label={"new password"} className={"mb-3"} >
            <Form.Control
              type="password"
              name="newPassword"
              autoComplete="new-password"
              placeholder="Password"
              required
              isInvalid={this.state.newPasswordIsInvalid}
              value={this.state.newPassword}
              onChange={this.handleChange}
            />
            <Form.Control.Feedback type={"invalid"} >
              {this.state.newPasswordFeedback}
            </Form.Control.Feedback>
          </FloatingLabel>
          <FloatingLabel label={"Confirm new password"} className={"mb-3"} >
            <Form.Control
              type="password"
              name="confirmNewPassword"
              autoComplete="new-password"
              placeholder="Confirm new password"
              required
              isInvalid={this.state.confirmNewPasswordIsInvalid}
              value={this.state.confirmNewPassword}
              onChange={this.handleChange}
            />
            <Form.Control.Feedback type={"invalid"} >
              {this.state.confirmNewPasswordFeedback}
            </Form.Control.Feedback>
          </FloatingLabel>
          <Button type={"submit"} >Change Password</Button>
        </Form>
      </>
    )
  }
}
