import React, { Component } from "react";
import PageTitle from "../../../components/pageTitle/PageTitle";
import { Route, RouteComponentProps } from "react-router-dom";

// import components
import CustomButton from "../../../components/button/CustomButton";
import { Button, Modal } from "react-bootstrap";
import Payment from "./payment/Payment";

// import utils
import { isEqual, round } from "lodash";
import { getObjectFromStorage, storeObjectInStorage } from "../../../utils/storage";

// Import interfaces
import {
  IParkingSpot,
  IReservation,
} from "../../../types";

// Interfaces
interface IProps {
  availableParkingSpots: IParkingSpot[],
  user: { email: string, token: string },
  enqueueNewAlert(variant: string, heading: string, message: string): void,
  setReservation(reservation: object): void,
  clearSetAvailableParkingSpotsInterval(): void,
  reservation: IReservation
}

interface IRouteParams {
  id: string,
}

interface IState {
  showModal: boolean,
  reservationLength: string,
  parkingSpot: IParkingSpot,
}


/**
 * This component summarises the anticipated reservation details and asks the user to provide some additional
 * reservation details.
 * Booking confirmation: parkingSpotId, whatThreeWords, gpsCoordinates, rates (/hour, /min)
 * User input: reservationLength, alertSubscription
 */
class ReserveSummary extends Component<IProps & RouteComponentProps<IRouteParams>, IState> {
  // parkingSpot: IParkingSpot

  constructor(props: IProps & RouteComponentProps<IRouteParams>) {
    super(props);
    this.state = {
      showModal: false,
      reservationLength: "",
      parkingSpot: getObjectFromStorage("parkingSpot", "session") as IParkingSpot
    }
  }

  componentDidUpdate(prevProps: Readonly<IProps & RouteComponentProps<IRouteParams>>) {
    // if available parking spots are not none and if they have changed
    // note: first condition is needed to avoid an alert showing upon reloading of the page (reload sets
    // prevProps.availableParkingSpots to null
    if (
      prevProps.availableParkingSpots &&
      !isEqual(prevProps.availableParkingSpots, this.props.availableParkingSpots
      )) {
      if (this.props.availableParkingSpots.some(parkingSpot => parkingSpot.id === this.state.parkingSpot.id)) {
        // if currently viewed parking spot id is still amongst the available parking spots (i.e. not reserved yet)
        // find updated parking spot with id of parkingSpot amongst currently available parking spots
        const updatedParkingSpot = this.props.availableParkingSpots.find(parkingSpot => {
          return parkingSpot.id === this.state.parkingSpot.id
        })

        // save old rate for usage in the alert (see enqueueNewAlert a few rows down)
        const oldRate = this.state.parkingSpot.rate

        // and update session storage parking spot and instance variable parking spot
        this.setState({ parkingSpot: updatedParkingSpot as IParkingSpot })
        storeObjectInStorage(updatedParkingSpot as IParkingSpot, "parkingSpot", "session")

        // display alert that tells the user that the rate of their selected parking spot has changed
        this.props.enqueueNewAlert(
          "info",
          "Rate Change!",
          `The rate has changed from $${oldRate} to $${updatedParkingSpot?.rate}.`
          )
      }
      else {
        // if currently viewed parking spot id is not amongst the available parking spots (i.e. it is already reserved)
        // open modal
        this.toggleModal()
      }
    }
  }

  /**
   * If currently viewed parking spot id not amongst the currently available parking spots, display the modal which
   * has one button that leads the user back to the /reserve view where they will have to find another parking spot
   * that is available
   */
  toggleModal = () => {
    this.setState( state => {
      return {showModal: !state.showModal}
    })
  }

  /**
   * Handle change of reservation length input field
   */
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    this.setState({ reservationLength: value })
  }

  render() {
    const parkingSpot = this.state.parkingSpot
    const parkingSpotGps = `Latitude: ${parkingSpot.lat} / Longitude: ${parkingSpot.lng}`
    const ratePerHour = Number(parkingSpot.rate)
    const ratePerMinute = Number(parkingSpot.rate) / 60
    const ratePerMinuteRounded = round(ratePerMinute, 2)
    const totalReservationCost = round(Number(this.state.reservationLength) * ratePerMinute, 2)

    return (
      <>
        <Route exact path="/reserve/:id">
          <div>
            <PageTitle titleText="Reservation Summary" />
            <h3>Parking Spot ID</h3>
            <p>{parkingSpot.id}</p>
            <h3>GPS Coordinates</h3>
            <p>{parkingSpotGps}</p>
            <h3>What Three Words</h3>
            {/* todo: action API call to WTW to convert GPS to whatthreewords */}
            <p>[to come]</p>
            <h3>Rate / hour</h3>
            <p>${ratePerHour.toFixed(2)}</p>
            <h3>Rate / min</h3>
            <p>${ratePerMinuteRounded.toFixed(2)}</p>
            <h3>Reservation Length (minutes)</h3>
            <input
              type="number"
              required
              value={this.state.reservationLength}
              onChange={this.handleChange}
            />
            <h3>Estimated Total Cost ($)</h3>
            <p>${totalReservationCost.toFixed(2)}</p>
          </div>
          <div>
            <CustomButton history={this.props.history} buttonText="Back" urlTarget="/reserve" />
            <CustomButton history={this.props.history} buttonText="Payment" urlTarget={`/reserve/${parkingSpot.id}/payment`} />
          </div>
        </Route>
        <Route path="/reserve/:id/payment">
          <Payment
            {...this.props}
            reservationLength={this.state.reservationLength}
            parkingSpotId={parkingSpot.id}
          />
        </Route>
        {/* Modal: displays an alert that currently viewed parking spot can no longer be reserved, leading the user back
        to the /reserve route */}
        <Modal
          show={this.state.showModal}
          backdrop={"static"}
          centered={true}
          keyboard={false}
          /*redirect user back to the /reserve route*/
          onExiting={() => this.props.history.push("/reserve")}
        >
          <Modal.Header>
            <Modal.Title>Somebody was faster...</Modal.Title>
          </Modal.Header>
          <Modal.Body>We are sorry! This parking spot is no longer available. You will be redirected to the map.</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.toggleModal}>
              Find Alternative Parking
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }
}

export default ReserveSummary
