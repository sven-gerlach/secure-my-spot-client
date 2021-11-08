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
import { Ireservation } from "../../types";


interface IProps {
  user?: { email: string, token: string },
  reservation: Ireservation
}

interface IState {
  reservations: null | {
    [index: number]: Ireservation
  }
}

class ReservationsView extends Component<RouteComponentProps & IProps, IState> {
  constructor(props: RouteComponentProps & IProps) {
    super(props);
    this.state = {
      reservations: null
    }
  }

  render() {
    let outputJSX = <></>

    if (this.props.user) {
      if (!this.state.reservations) {
        // reservations have not yet been retrieved from the API
        outputJSX = <p>Historic reservations are being loaded...</p>
      }
      else {
        if (Object.entries(this.state.reservations).length === 0) {
          // the returned reservations object is empty
          outputJSX = <p>You do not have any historic reservations</p>
        }
        else {
          // todo: implement the logic for displaying the reservations content
        }
      }
    }
    else {
      // user is not authenticated
      if (!this.props.reservation) {
        // display message that no reservation exists
        outputJSX = <p>You do not have any open reservations</p>
      }
      else {
        // display content of reservation object

      }
    }

    return (
      <>
        <PageTitle titleText={this.props.user ? "Reservations Summary" : "Open Reservation"} />
        {outputJSX}
      </>
    )
  }
}

export default ReservationsView
