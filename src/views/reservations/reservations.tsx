/**
 * Module for the My Reservations view.
 *
 * For the unauthenticated user this module reads the reservation key from local storage, provided there is one, and
 * displays the results on screen.
 *
 * For authenticated users this module makes an api request to retrieve all reservations, current and historic, to
 * display them.
 *
 * It also provides the option to amend any current reservations.
 */

// Imports
import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import PageTitle from "../../components/pageTitle/PageTitle";

// interfaces
interface IProps {
  user?: { email: string, token: string },
  reservation: {
    id: number,
    user?: number,
    email: string,
    parking_spot: number,
    rate: string,
    paid: boolean,
    start_time: string,
    end_time: string
  }
}

class ReservationsView extends Component<RouteComponentProps & IProps> {
  render() {
    return (
      <>
        <PageTitle titleTest="Reservations Summary" />
      </>
    )
  }
}

export default ReservationsView
