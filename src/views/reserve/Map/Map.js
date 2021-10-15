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
      zoom: 17,
      maxZoom: 20,
      minZoom: 10,
      clickableIcons: false,
      mapId: "121750dd1eb03810",
      restriction: {
        latLngBounds: { north: 40.86, south: 40.56, west: -74.21, east: -73.746 }
      },
      streetViewControl: false
    })

    // todo: panToBounds method with limits set by the set of most North, West, East, and South available spots
    // todo: clicking on a marker needs to cause the opening of a Info Window which displays the reservation price and a button to reserve

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


