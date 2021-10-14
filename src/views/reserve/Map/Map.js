import React, { Component } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";


class Map extends Component {
  constructor(props) {
    super(props);

    this.containerStyle = {
      width: '400px',
      height: '400px'
    };

    this.center = {
      lat: -3.745,
      lng: -38.523
    };

    this.apiKey = process.env.REACT_APP_GOOGLE_MAPS_KEY
  }

  render() {
    return (
      <LoadScript googleMapsApiKey={this.apiKey}
      >
        <GoogleMap
          mapContainerStyle={this.containerStyle}
          center={this.center}
          zoom={10}
        >
          { /* Child components, such as markers, info windows, etc. */ }
        </GoogleMap>
      </LoadScript>
    )
  }
}

export default Map
