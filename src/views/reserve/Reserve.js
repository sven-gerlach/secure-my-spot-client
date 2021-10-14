// import React components
import React, {Component} from "react";
import { Wrapper } from "@googlemaps/react-wrapper";

// import utility components
import PageTitle from "../../components/pageTitle/PageTitle";
// import Map from "./Map/Map";
import Map from "./Map/Map";


class ReserveView extends Component {
  render() {
    return (
      <>
        <PageTitle titleText="Reserve Available Parking Slots Near You" />
        <Wrapper apiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}>
          <Map />
        </Wrapper>
      </>
    )
  }
}

export default ReserveView
