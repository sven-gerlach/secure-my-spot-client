import React, { Component } from "react";
import { IReservation } from "../../../types";
import { RouteComponentProps } from "react-router-dom";
import { getReservationUnauth } from "../../../httpRequests/reservation";
import camelcaseKeys from "camelcase-keys";
import messages from "../../../utils/alertMessages";
import Reservation from "../reservation/reservation";
import { ButtonStyled, FormStyled, H2Styled } from "../reservations.styles";
import { FloatingLabel, Form } from "react-bootstrap";


interface IProps {
  enqueueNewAlert: (variant: string, heading: string, message: string) => void,
  user?: { email: string, token: string },
  reservation: IReservation,
  setReservation: (reservation: IReservation | null) => void,
}

interface IState {
  emailField: string,
  reservationIdField: string,
  findReservationFormValidated: boolean,
}

export default class ReservationsUnauth extends Component<RouteComponentProps & IProps, IState> {
  constructor(props: RouteComponentProps & IProps) {
    super(props);
    this.state = {
      emailField: "",
      reservationIdField: "",
      findReservationFormValidated: false
    }
  }

  handleInputValueChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name
    const value = e.target.value
    this.setState(
      { [key]: value } as Pick<IState, "emailField" | "reservationIdField">
    )
  }

  /**
   * Retrieve a reservation for an unauthenticated user, given the provided email and the reservationID
   * @param e
   */
  handleRetrieveReservationUnauth = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.stopPropagation()
      this.setState({findReservationFormValidated: true})
    }
    else {
      // call API
      getReservationUnauth(this.state.reservationIdField, this.state.emailField)
        .then((res: { data: IReservation | null; }) => {
          // todo: loading another but still current reservation causes the endTime input field to be displayed incorrectly
          const data = camelcaseKeys(res.data!)
          this.props.setReservation(data)
          // reset form
          this.setState({findReservationFormValidated: false, emailField: "", reservationIdField: ""})
          this.props.enqueueNewAlert(...messages.reservationFound)
        })
        .catch((e: any) => {
          if (e.response.status === 404) {
            this.props.enqueueNewAlert(...messages.notFound404)
          }
        })
    }
  }

  render() {
    return (
      <>
        {/* Display the reservation, if available */}
        {this.props.reservation && (
          <Reservation
            {...this.props}
          />
        )}

        {this.props.reservation && (
          <H2Styled>Find Another Reservation</H2Styled>
        )}

        {/* display form field for email and reservationID that retrieves any reservation, active or not, that matches
        the email and reservation id */}
        <FormStyled noValidate validated={this.state.findReservationFormValidated} onSubmit={this.handleRetrieveReservationUnauth}>
          <FloatingLabel
            controlId="floatingInput"
            label="e-Mail"
            className="mb-3"
          >
            <Form.Control
              type="email"
              name="emailField"
              placeholder="a"
              onChange={this.handleInputValueChange}
              value={this.state.emailField}
              required
            />
            <Form.Control.Feedback type={"invalid"}>Enter a valid email address</Form.Control.Feedback>
          </FloatingLabel>
          <FloatingLabel controlId="floatingPassword" label="Reservation ID">
            <Form.Control
              type="text"
              placeholder="a"
              name="reservationIdField"
              onChange={this.handleInputValueChange}
              value={this.state.reservationIdField}
              required
            />
            <Form.Control.Feedback type={"invalid"}>Enter a valid reservation ID</Form.Control.Feedback>
          </FloatingLabel>
          <ButtonStyled variant="primary" type="submit">
            Find
          </ButtonStyled>
        </FormStyled>
      </>
    )
  }
}
