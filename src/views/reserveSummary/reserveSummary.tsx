import React, { Component } from "react";
import PageTitle from "../../components/pageTitle/PageTitle";
import { RouteComponentProps } from "react-router-dom";

// import components
import CustomButton from "../../components/button/CustomButton";
import { Button, Modal } from "react-bootstrap";

// import utils
import { isEqual, round } from "lodash";
import { getObjectFromStorage, storeObjectInStorage } from "../../utils/sessionStorage";

// Import interfaces
import { ParkingSpot } from "../../types";

// Interfaces
interface IProps {
  availableParkingSpots: ParkingSpot[],
}

interface IRouteParams {
  id: string,
}

interface IState {
  showModal: boolean
}


/**
 * This component summarises the anticipated reservation and asks the user to provide some additional reservation
 * details.
 * Booking confirmation: parkingSpotId, whatThreeWords, gpsCoordinates, rates (/hour, /min)
 * User input: reservationLength, alertSubscription
 */
class ReserveSummary extends Component<IProps & RouteComponentProps<IRouteParams>, IState> {
  parkingSpot: ParkingSpot

  constructor(props: IProps & RouteComponentProps<IRouteParams>) {
    super(props);
    this.parkingSpot = getObjectFromStorage("parkingSpot", "session") as ParkingSpot
    this.state = {
      showModal: false
    }
  }

  componentDidUpdate(prevProps: Readonly<IProps & RouteComponentProps<IRouteParams>>) {
    // if available parking spots have changed
    if (!isEqual(prevProps.availableParkingSpots, this.props.availableParkingSpots)) {
      if (this.props.availableParkingSpots.some(parkingSpot => parkingSpot.id === this.parkingSpot.id)) {
        // if currently viewed parking spot id is still amongst the available parking spots (i.e. not reserved yet)
        // find updated parking spot with id of parkingSpot amongst currently available parking spots
        const updatedParkingSpot = this.props.availableParkingSpots.find(parkingSpot => {
          return parkingSpot.id === this.parkingSpot.id
        })

        // and update session storage parking spot and instance variable parking spot
        this.parkingSpot = updatedParkingSpot as ParkingSpot
        storeObjectInStorage(this.parkingSpot, "parkingSpot", "session")
      }
      else {
        // if currently viewed parking spot id is not amongst the available parking spots (i.e. it is already reserved)
        // open modal
        this.toggleModal()
      }
    }
  }

  toggleModal = () => {
    this.setState( state => {
      return {showModal: !state.showModal}
    })
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
          <CustomButton history={this.props.history} buttonText="Back" urlTarget="/reserve" />
          <CustomButton history={this.props.history} buttonText="Payment" urlTarget="/payment" />
        </div>
        <Modal
          show={this.state.showModal}
          /*onHide={() => this.setState({ showModal: false })}*/
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
