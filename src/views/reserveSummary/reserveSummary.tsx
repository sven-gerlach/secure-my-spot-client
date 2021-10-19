import React, { Component } from "react";
import PageTitle from "../../components/pageTitle/PageTitle";
import { RouteComponentProps } from "react-router-dom";

// import components
import Button from "../../components/button/Button";

// import utils
import { isEqual, round } from "lodash";
import { getObjectFromStorage, storeObjectInStorage } from "../../utils/sessionStorage";

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

  componentDidUpdate(prevProps: Readonly<Props & RouteComponentProps<RouteParams>>) {
    // if available parking spots have changed
    if (!isEqual(prevProps.availableParkingSpots, this.props.availableParkingSpots)) {
      if (this.props.availableParkingSpots.some(parkingSpot => parkingSpot.id === this.parkingSpot.id)) {
        // if currently viewed parking spot id is still amongst the available parking spots (i.e. not reserved yet)
        // find updated parking spot with id of parkingSpot amongst currently available parking spots
        const updatedParkingSpot = this.props.availableParkingSpots.find(parkingSpot => {
          return parkingSpot.id === this.parkingSpot.id
        })

        // and update session storage parking spot and this parking spot
        this.parkingSpot = updatedParkingSpot as ParkingSpot
        storeObjectInStorage(this.parkingSpot, "parkingSpot", "session")
      }
      else {
        // if currently viewed parking spot id is not amongst the available parking spots (i.e. it is already reserved)
        // todo: create a pop-up window alerting the user that this particular parking spot is no longer available and clicking any button will route the user back to /reserve
        this.props.history.push("/reserve")
      }
    }
  }

  render() {
    const parkingSpotGps = `Latitude: ${this.parkingSpot.lat} / Longitude: ${this.parkingSpot.lng}`

    

    return (
      <>
        <div>
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
        </div>
        <div>
          <Button history={this.props.history} buttonText="Back" urlTarget="/reserve" />
          <Button history={this.props.history} buttonText="Payment" urlTarget="/payment" />
        </div>
      </>
    )
  }
}

export default ReserveSummary
