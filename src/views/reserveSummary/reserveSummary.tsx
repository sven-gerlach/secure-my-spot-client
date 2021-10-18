import React, { Component } from "react";
import PageTitle from "../../components/pageTitle/PageTitle";


// Interfaces
interface Props {
  availableParkingSpots: [],
  history: {},
  location: {},
  match: {}
}

/**
 * This component summarises the anticipated reservation and asks the user to provide some additional reservation
 * details.
 * Booking confirmation: parkingSpotId, whatThreeWords, gpsCoordinates, rates (/hour, /min)
 * User input: reservationLength, alertSubscription
 */
class ReserveSummary extends Component<Props> {
  render() {
    console.log(this.props)
    return (
      <>
        <PageTitle titleText="Reservation Summary" />
        <h3>Parking Spot ID</h3>
        {/*<p>{this.props.match.params}</p>*/}
      </>
    )
  }
}

export default ReserveSummary
