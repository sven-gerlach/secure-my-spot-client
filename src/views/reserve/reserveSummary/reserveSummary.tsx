import React, { Component } from "react";
import PageTitle from "../../../components/pageTitle/PageTitle";
import { Route, RouteComponentProps } from "react-router-dom";

// import components
import CustomButton from "../../../components/button/CustomButton";
import { Button, Modal } from "react-bootstrap";
import StripePayments from "./payment/StripePayments";

// import utils
import { isEqual, round } from "lodash";
import { getObjectFromStorage, storeObjectInStorage } from "../../../utils/storage";

// Import interfaces
import {
  IParkingSpot,
  IReservation,
} from "../../../types";
import { createReservationAuthUser, createReservationUnauthUser } from "../../../httpRequests/reservation";
import camelcaseKeys from "camelcase-keys";

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
  email: string,
}


/**
 * This component summarises the anticipated reservation details and asks the user to provide some additional
 * reservation details.
 * Booking confirmation: parkingSpotId, whatThreeWords, gpsCoordinates, rates (/hour, /min)
 * User input: reservationLength, alertSubscription
 */
class ReserveSummary extends Component<IProps & RouteComponentProps<IRouteParams>, IState> {
  constructor(props: IProps & RouteComponentProps<IRouteParams>) {
    super(props);
    this.state = {
      showModal: false,
      reservationLength: "",
      parkingSpot: getObjectFromStorage("parkingSpot", "session") as IParkingSpot,
      email: "",
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
   * Handle change of input fields
   */
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name
    const value = e.target.value
    this.setState({ [key]: value } as Pick<IState, "reservationLength" | "email">)
  }

  handlePaymentClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    // stop getting and setting available parking spots to prevent the reservation of a parking spot causing the
    // "unavailable parking-spot" modal to pop up
    this.props.clearSetAvailableParkingSpotsInterval()

    if (this.props.user) {
      // send reservationLength to API

      const data = {
        "reservation": {
          "reservation_length": this.state.reservationLength
        }
      }

      // make http post request to create new reservation resource
      createReservationAuthUser(this.state.parkingSpot.id, this.props.user.token, data)
        .then((res: { data: object; }) => {
          // convert object keys to camelCase
          const data = camelcaseKeys(res.data)
          // call setReservation in App view, which stores reservation in App state and stores it in local storage
          console.log("Cancel reservation 5")
          this.props.setReservation(data)
        })
        .catch((e: { response: { data: { [x: string]: any[]; }; }; }) => {
          console.error(e)
        })
    } else {
      // send reservationLength and email to API

      const data = {
        "reservation": {
          "email": this.state.email,
          "reservation_length": this.state.reservationLength
        }
      }

      // make http post request to create a new reservation resource
      createReservationUnauthUser(this.state.parkingSpot.id, data)
        .then((res: { data: object; }) => {
          // convert object keys to camelCase
          const data = camelcaseKeys(res.data)
          // call setReservation in App view, which stores reservation in App state and stores it in local storage
          console.log(data)
          console.log("Cancel reservation 6")
          this.props.setReservation(data)
        })
        .then((res: any) => {
          this.props.history.push(`/reserve/${this.props.reservation.id}/payment`)
        })
        .catch((e: { response: { data: { [x: string]: any[]; }; }; }) => {
          console.error(e)
        })
        .finally(() => {
          // reset the email field
          this.setState({ email: "" })
        })
    }
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
            {/* todo: add validation to set min value to e.g. 5min */}
            <input
              name={"reservationLength"}
              type={"number"}
              value={this.state.reservationLength}
              onChange={this.handleChange}
              required
            />
            <h3>Estimated Total Cost ($)</h3>
            <p>${totalReservationCost.toFixed(2)}</p>
            {!this.props.user && (
              <input
                name={"email"}
                value={this.state.email}
                onChange={this.handleChange}
                placeholder="e-Mail"
                required
              />
            )}
          </div>
          <div>
            <CustomButton
              history={this.props.history}
              buttonText="Back"
              urlTarget="/reserve"
            />
            <CustomButton
              history={this.props.history}
              buttonText="Payment"
              handleSubmit={this.handlePaymentClick}
            />
          </div>
        </Route>
        <Route path="/reserve/:id/payment">
          <StripePayments
            {...this.props}
            email={this.state.email}
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
