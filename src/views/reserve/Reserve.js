// import React components
import React, {Component} from "react";

// import utility components
import PageTitle from "../../components/pageTitle/PageTitle";
import Map from "./Map/Map";


class ReserveView extends Component {
  render() {
    return (
      <>
        <PageTitle titleText="Reserve Available Parking Slots Near You" />
        <Map />
      </>
    )
  }
}


export default ReserveView
