import React, { Component } from "react";
import PageTitle from "../../../components/pageTitle/PageTitle";
import { Route, RouteComponentProps } from "react-router-dom";

// import components
import CustomButton from "../../../components/button/CustomButton";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import StripePayments from "./payment/StripePayments";
import { Reservation } from "../../../components/reservation/Reservation";

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

// import styles
import {
  DivFormsStyled,
  DivButtonsStyled
} from "./reserveSummary.styles";

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
  validated: boolean,
}


/**
 * This component summarises the anticipated reservation details and asks the user to provide some additional
 * reservation details.
 * Booking confirmation: parkingSpotId, whatThreeWords, gpsCoordinates, rates (/hour, /min)
 * User input: reservationLength, alertSubscription
 */
class ReserveSummary extends Component<IProps & RouteComponentProps<IRouteParams>, IState> {
  formRef: React.RefObject<HTMLFormElement>

  constructor(props: IProps & RouteComponentProps<IRouteParams>) {
    super(props);
    this.formRef = React.createRef()
    this.state = {
      showModal: false,
      reservationLength: "",
      parkingSpot: getObjectFromStorage("parkingSpot", "session") as IParkingSpot,
      email: "",
      validated: false,
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

    this.setState({validated: true})

    const form = this.formRef.current;

    if (!form?.checkValidity()) {
      e.stopPropagation()
    }
    else {
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
            this.props.setReservation(data)
          })
          .catch((e: { response: { data: { [x: string]: any[]; }; }; }) => {
            this.props.enqueueNewAlert(
              "danger",
              "Oops...",
              Object.values(e.response.data)[0][0]
            )
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
            this.props.setReservation(data)
          })
          .then((res: any) => {
            this.props.history.push(`/reserve/${this.props.reservation.id}/payment`)
          })
          .catch((e: { response: { data: { [x: string]: any[]; }; }; }) => {
            this.props.enqueueNewAlert(
              "danger",
              "Oops...",
              Object.values(e.response.data)[0][0]
            )
          })
          .finally(() => {
            // reset the email field
            this.setState({ email: "" })
          })
      }
    }
  }

  render() {
    const parkingSpot = this.state.parkingSpot
    const parkingSpotGps = `${parkingSpot.lat} / ${parkingSpot.lng}`
    const ratePerHour = Number(parkingSpot.rate)
    const ratePerMinute = Number(parkingSpot.rate) / 60
    const totalReservationCost = round(Number(this.state.reservationLength) * ratePerMinute, 2)

    return (
      <>
        <Route exact path="/reserve/:id">
          <div>
            <PageTitle titleText="Reservation Summary" />
            <Reservation
                parkingSpotID={parkingSpot.id}
                parkingSpotGPS={parkingSpotGps}
                ratePerHour={ratePerHour}
                ratePerMinute={ratePerMinute}
                totalReservationCost={totalReservationCost}
            />
            <DivFormsStyled>
              <Form
                noValidate
                validated={this.state.validated}
                ref={this.formRef}
              >
                <FloatingLabel
                  controlId="floatingMinutes"
                  label="reservation length (minutes)"
                  className="mb-3"
                >
                  <Form.Control
                    type="number"
                    name={"reservationLength"}
                    value={this.state.reservationLength}
                    onChange={this.handleChange}
                    placeholder="0"
                    min={"5"}
                    max={"240"}
                    required
                  />
                  <Form.Control.Feedback type={"invalid"}>
                    Desired reservation length must be between 5 and 240 minutes
                  </Form.Control.Feedback>
                </FloatingLabel>
                {!this.props.user &&
                  <FloatingLabel controlId={"floatingEmail"} label={"e-Mail"} >
                    <Form.Control
                      type={"email"}
                      name={"email"}
                      value={this.state.email}
                      onChange={this.handleChange}
                      placeholder={"name@email.com"}
                      required
                    />
                    <Form.Control.Feedback type={"invalid"}>
                      Enter a valid email address
                    </Form.Control.Feedback>
                  </FloatingLabel>
                }
              </Form>
            </DivFormsStyled>
            <DivButtonsStyled>
              <CustomButton
                variant={"secondary"}
                history={this.props.history}
                buttonText="Back"
                urlTarget="/reserve"
              />
              <CustomButton
                variant={"primary"}
                history={this.props.history}
                buttonText="Payment"
                handleSubmit={this.handlePaymentClick}
              />
            </DivButtonsStyled>
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
