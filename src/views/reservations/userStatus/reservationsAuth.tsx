import React, { Component } from "react";
import { IReservation } from "../../../types";
import { RouteComponentProps } from "react-router-dom";
import Reservation from "../reservation/reservation";
import { DivStyled, H3Styled } from "../reservations.styles";
import CustomButton from "../../../components/button/CustomButton";
import { getActiveReservationsAuth, getExpiredReservationsAuth } from "../../../httpRequests/reservation";
import camelcaseKeys from "camelcase-keys";


interface IProps {
  enqueueNewAlert: (variant: string, heading: string, message: string) => void,
  user?: { email: string, token: string },
  reservation: IReservation,
  setReservation: (reservation: IReservation | null) => void,
  handleSetPageTitleState: (pageTitle: string) => void,
}

interface IState {
  reservations: IReservation[],
}

export default class ReservationsAuth extends Component<RouteComponentProps & IProps, IState> {
  constructor(props: RouteComponentProps & IProps) {
    super(props);
    this.state = {
      reservations: [],
    }
  }

  componentDidMount() {
    // retrieve any active reservations from the api
    this.handleActiveReservationsAuth()
  }

  /**
   * Make api call to retrieve all active reservations for an authenticated user
   */
  handleActiveReservationsAuth = () => {
    // change page title
    this.props.handleSetPageTitleState("My Active Reservations")

    // set reservation in local storage to null
    this.props.setReservation(null)

    // retrieve active reservations from API
    getActiveReservationsAuth(this.props.user?.token)
      .then((res: { data: any; }) => {
        const data = camelcaseKeys(res.data)
        this.setState({ reservations: data })
      })
      .catch((e: any) => {
        console.error(e)
      })
  }

  /**
   * Make apu call to retrieve all expired reservations for an authenticated user
   */
  handleExpiredReservationsAuth = () => {
    // change page title
    this.props.handleSetPageTitleState("My Expired Reservations")

    getExpiredReservationsAuth(this.props.user?.token)
      .then((res: { data: any; }) => {
        const data = camelcaseKeys(res.data)
        this.setState({ reservations: data })
      })
      .catch((e: any) => {
        console.error(e)
      })
  }


  render() {
    let reservationJSX: JSX.Element[] | JSX.Element = <></>

    // if no reservation is stored in App state, display a message
    if (this.state.reservations.length > 0) {
      reservationJSX = (
        this.state.reservations.map(reservation => (
          <Reservation
            key={reservation.id}
            {...this.props}
            reservation={reservation}
            handleActiveReservationsAuth={this.handleActiveReservationsAuth}
          />
        ))
      )
    }
    else {
      reservationJSX = <p>No reservations available...</p>
    }

    return (
      <>
        {reservationJSX}
        <H3Styled>Not what you are looking for?</H3Styled>
        <p>You can also display all of your active or expired reservations.</p>
        <DivStyled>
          <CustomButton
            buttonText="Active"
            handleSubmit={this.handleActiveReservationsAuth}
          />
          <CustomButton
            buttonText="Expired"
            handleSubmit={this.handleExpiredReservationsAuth}
          />
        </DivStyled>
      </>
    )
  }
}
