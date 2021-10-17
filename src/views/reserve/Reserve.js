// import React components
import React, {Component} from "react";

// https://cloud.google.com/blog/products/maps-platform/loading-google-maps-platform-javascript-modern-web-applications
// https://www.npmjs.com/package/@googlemaps/js-api-loader
// This wrapper loads the Loader and makes google.maps accessible in the child component's namespace
import { Wrapper } from "@googlemaps/react-wrapper";

// import utility components
import PageTitle from "../../components/pageTitle/PageTitle";
// import Map from "./Map/Map";
import Map from "./Map/Map";
import { round } from "lodash";


/**
 * Component for the reserve view. This component is stateful, explicitly it stores the user's location and all
 * available parking slots.
 */
class ReserveView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userLocation: { lat: 40.754287, lng: -73.988412 },
      availableParkingSpots: null
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
  }

  setAvailableParkingSpots = availableParkingSpots => {
    this.setState({
      availableParkingSpots: availableParkingSpots
    })
  }

  render() {
    return (
      <>
        <PageTitle titleText="Reserve Available Parking Slots Near You" />
        <Wrapper apiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}>
          <Map
            availableParkingSpots={this.state.availableParkingSpots}
            userLocation={this.state.userLocation}
            setAvailableParkingSpots={this.setAvailableParkingSpots}
          />
        </Wrapper>
      </>
    )
  }
}

export default ReserveView
