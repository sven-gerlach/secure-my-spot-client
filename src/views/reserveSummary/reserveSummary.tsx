import React, { Component } from "react";
import PageTitle from "../../components/pageTitle/PageTitle";
import { RouteComponentProps } from "react-router-dom";

// import utils
import { round } from "lodash";
import { getObjectFromStorage } from "../../utils/sessionStorage";

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
  parkingSpot: ParkingSpot

  // todo: need to deal with the case where another user reserves this particular parking spot first
  constructor(props: Props & RouteComponentProps<RouteParams>) {
    super(props);
    this.parkingSpot = getObjectFromStorage("parkingSpot", "session") as ParkingSpot
  }

  render() {
    const parkingSpotGps = `Latitude: ${this.parkingSpot.lat} / Longitude: ${this.parkingSpot.lng}`

    return (
      <>
        <PageTitle titleText="Reservation Summary" />
        <h3>Parking Spot ID</h3>
        <p>{this.parkingSpot.id}</p>
        <h3>GPS Coordinates</h3>
        <p>{parkingSpotGps}</p>
        <h3>What Three Words</h3>
        {/* todo: action API call to WTW to convert GPS to whatthreewords */}
        <p>[to come]</p>
        <h3>Rate ($ / hour)</h3>
        <p>{this.parkingSpot.rate}</p>
        <h3>Rate ($ / min)</h3>
        <p>{round(Number(this.parkingSpot.rate) / 60, 2)}</p>
      </>
    )
  }
}

export default ReserveSummary
