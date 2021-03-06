// import React components
import React, {Component} from "react";
import { Route } from "react-router-dom";

// import components
import PageTitle from "../../components/pageTitle/PageTitle";
import ReserveSummary from "./reserveSummary/reserveSummary";

// https://cloud.google.com/blog/products/maps-platform/loading-google-maps-platform-javascript-modern-web-applications
// https://www.npmjs.com/package/@googlemaps/js-api-loader
// This wrapper loads the Loader and makes google.maps accessible in the child component's namespace
import { Wrapper } from "@googlemaps/react-wrapper";

// import Map from "./Map/Map";
import Map from "./Map/Map";
import { round } from "lodash";
import { getAllAvailableParkingSpots } from "../../httpRequests/parkingSpots";

// import utils
import camelcaseKeys from "camelcase-keys";
import messages from "../../utils/alertMessages";


/**
 * Component for the reserve view. This component is stateful, explicitly it stores the user's location and all
 * available parking slots.
 */
class ReserveView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userLocation: { lat: 40.754287, lng: -73.988412 },
      availableParkingSpots: null,
      isSpinnerDisplayed: false,
    }
  }

  /**
   * Make an api request to retrieve all currently available parking spots. Store the array of dictionaries in state
   */
  componentDidMount() {
    // retrieve current geo location of user
    if ('geolocation' in navigator) {
      /* browser supports geo-location */
      navigator.geolocation.getCurrentPosition((position) => {
        // note the use of lng instead of Long -> this is due to Google map's use of this term
        this.setState({
          userLocation: { lat: round(position.coords.latitude, 6), lng: round(position.coords.longitude, 6) }
        })
      })
    }
    // start spinner
    this.setState({isSpinnerDisplayed: true})
    // retrieve available parking spots from API immediately
    this.setAvailableParkingSpots()
    // and set up an interval api request to retrieve available parking spots every 5 seconds
    this.setAvailableParkingSpotsIntervalID = setInterval(this.setAvailableParkingSpots, 5000)
  }

  setAvailableParkingSpots = availableParkingSpots => {
    getAllAvailableParkingSpots()
      .then(res => {
        const data = camelcaseKeys(res.data)
        this.setState({
          availableParkingSpots: data
        })
      })
      .catch(error => {
        this.props.enqueueNewAlert(...messages.failedRetrievalAvailableSpots)
      })
      .finally(() => this.setState({isSpinnerDisplayed: false}))
  }

  clearSetAvailableParkingSpotsInterval = () => {
    clearInterval(this.setAvailableParkingSpotsIntervalID)
  }

  componentWillUnmount() {
    this.clearSetAvailableParkingSpotsInterval()
  }

  render() {
    return (
      <>
        <Route exact path="/reserve">
          <PageTitle titleText="Find Parking Near You" />
          <Wrapper apiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}>
            <Map
              availableParkingSpots={this.state.availableParkingSpots}
              userLocation={this.state.userLocation}
              history={this.props.history}
              isSpinnerDisplayed={this.state.isSpinnerDisplayed}
            />
          </Wrapper>
        </Route>
        <Route path="/reserve/:id" render={(props) => (
          <ReserveSummary
            {...this.props}
            availableParkingSpots={this.state.availableParkingSpots}
            clearSetAvailableParkingSpotsInterval={this.clearSetAvailableParkingSpotsInterval}
          />
        )} />
      </>
    )
  }
}

export default ReserveView
