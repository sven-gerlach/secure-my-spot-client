import React, { Component } from "react";
import PageTitle from "../../components/pageTitle/PageTitle";
import { RouteComponentProps } from "react-router-dom";

// import utils
import { round } from "lodash";

// Import interfaces
import { ParkingSpot } from "../../types";

// Interfaces
interface Props {
  availableParkingSpots: ParkingSpot[],
}
interface RouteParams {
  id: string,
}

/**
 * This component summarises the anticipated reservation and asks the user to provide some additional reservation
 * details.
 * Booking confirmation: parkingSpotId, whatThreeWords, gpsCoordinates, rates (/hour, /min)
 * User input: reservationLength, alertSubscription
 */
class ReserveSummary extends Component<Props & RouteComponentProps<RouteParams>> {
  render() {
    const parkingSpotId = this.props.match.params.id
    const parkingSpot = this.props.availableParkingSpots.filter(parkingSpot => parkingSpot.id == parkingSpotId)[0]
    const parkingSpotGps = `Latitude: ${parkingSpot.lat} / Longitude: ${parkingSpot.lng}`

    return (
      <>
        <PageTitle titleText="Reservation Summary" />
        <h3>Parking Spot ID</h3>
        <p>{parkingSpotId}</p>
        <h3>GPS Coordinates</h3>
        <p>{parkingSpotGps}</p>
        <h3>What Three Words</h3>
        {/* todo: action API call to WTW to convert GPS to whatthreewords */}
        <p>[to come]</p>
        <h3>Rate ($ / hour)</h3>
        <p>{parkingSpot.rate}</p>
        <h3>Rate ($ / min)</h3>
        <p>{round(Number(parkingSpot.rate) / 60, 2)}</p>
      </>
    )
  }
}

export default ReserveSummary
