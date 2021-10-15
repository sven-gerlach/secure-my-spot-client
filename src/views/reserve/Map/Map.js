import React, { Component } from "react";

// import styles
import MapDiv from "./map.styles";
import { getAllAvailableParkingSpots } from "../../../httpRequests/parkingSpots";
import { MarkerClusterer } from "@googlemaps/markerclusterer"


class Map extends Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef()
  }
  // todo: factor out location button and make it a separate button on the page
  // todo: load current location automatically at the time of mounting the map
  // todo: make sure location is controlled by state

  componentDidMount() {
    const map = new window.google.maps.Map(this.mapRef.current, {
      center: this.props.userLocation,
      zoom: 8,
    })

    // store map as a property on the class instance
    this.map = map

    // retrieve available parking spots
    getAllAvailableParkingSpots()
      .then(res => {
        this.props.setAvailableParkingSpots(res.data)
      })
      .catch(error => {
        console.error(error)
      })
  }

  componentDidUpdate = (prevProps) => {
    // set a marker for all available parking spots
    // todo: change api nomenclature "long" to "lng"
    const map = this.map
    if (this.props.availableParkingSpots !== prevProps.availableParkingSpots) {
      const markers = this.props.availableParkingSpots.map((location) => {
        return new window.google.maps.Marker({
          position: { lat: Number(location.latitude), lng: Number(location.longitude) }
        })
      })
      // Add marker cluster to manage the markers
      new MarkerClusterer({ markers, map })
    }
  }

  render() {
    return (
      <MapDiv
        ref={this.mapRef}
      />
    )
  }
}

export default Map


