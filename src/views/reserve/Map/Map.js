import React, { Component } from "react";
import { round } from "lodash";

// import styles
import MapDiv from "./map.styles";
import { getAllAvailableParkingSpots } from "../../../httpRequests/parkingSpots";
import { MarkerClusterer } from "@googlemaps/markerclusterer"
import parkingSign from "../../../assets/img/parking_sign_icon.png"


class Map extends Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef()
  }
  // todo: factor out location button and make it a separate button on the page
  // todo: load current location automatically at the time of mounting the map
  // todo: make sure location is controlled by state

  createMap() {
    this.map = new window.google.maps.Map(this.mapRef.current, {
      center: this.props.userLocation,
      zoom: 12,
      maxZoom: 20,
      minZoom: 12,
      clickableIcons: false,
      mapId: "121750dd1eb03810",
      restriction: {
        latLngBounds: { north: 40.86, south: 40.56, west: -74.21, east: -73.746 }
      },
      streetViewControl: false,
      tilt: 0,
      disableDefaultUI: true,
      zoomControl: true,
      fullscreenControl: true,
    })

  }

  createMyLocationMarker() {
    const myLocationMarker = new window.google.maps.Marker({
      clickable: false,
      icon: new window.google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
        new window.google.maps.Size(22,22),
        new window.google.maps.Point(0,18),
        new window.google.maps.Point(11,11)),
      shadow: null,
      zIndex: 999,
      map: this.map,
    });

    // todo: what if user doesn't allow location data inside their browser
    // todo: what if the user does allow location services but is not located in NYC
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(pos) {
        const myPosition = new window.google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        myLocationMarker.setPosition(myPosition);
      }, function(error) {
        console.error(error)
      });
    }
  }

  // creates markers, info windows, and sets event listeners
  createParkingSpots() {
    this.markers = []
    for (const parkingSpot of this.props.availableParkingSpots) {
      // create marker
      const marker = new window.google.maps.Marker({
        position: { lat: Number(parkingSpot.lat), lng: Number(parkingSpot.lng) },
        label: {
          text: `$${round(parkingSpot.rate, 0)}`,
          color: "red",
          fontWeight: "900"
        },
        icon: {
          url: parkingSign,
          labelOrigin: { x: 7, y: -8 }
        }
      })

      // add event listener to marker
      marker.addListener("click", event => {
        // pan to parking spot
        this.map.panTo(event.latLng)
        // open the info window
        this.openInfoWindow(marker, parkingSpot)
      })

      this.markers.push(marker)
    }
  }

  openInfoWindow(marker, parkingSpot) {
    const htmlString = `
      <div>
        <p><b>Price ($/hr):</b>&nbsp;${round(parkingSpot.rate, 2).toFixed(2)}</p>
        <p><b>Price ($/min):</b>&nbsp;${round(parkingSpot.rate / 60, 2).toFixed(2)}</p>
        <button>Reserve</button>
      </div>
    `

    const infoWindow = new window.google.maps.InfoWindow({
      content: htmlString,
      maxWidth: 400
    })

    infoWindow.open({
      anchor: marker,
      map: this.map,
      shouldFocus: true
    })

    // add click listener to map which closes the infoWindow and removes itself after one click
    new window.google.maps.event.addListenerOnce(this.map, "click", () => {
      infoWindow.close()
    })
  }

  componentDidMount() {
    // create the map
    this.createMap()

    // create my location marker
    this.createMyLocationMarker()

    // todo: panToBounds method with limits set by the set of most North, West, East, and South available spots
    // todo: clicking on a marker needs to cause the opening of a Info Window which displays the reservation price and a button to reserve

    // retrieve all currently available parking spots only upon loading of the map from the api and store them in state of the parent component
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
    if (this.props.availableParkingSpots !== prevProps.availableParkingSpots) {
      this.createParkingSpots()

      // Add marker cluster to manage the markers
      const markers = this.markers
      const map = this.map
      new MarkerClusterer({ markers, map })
    }

    // updates the map with the current user location
    if (this.props.userLocation !== prevProps.userLocation) {
      this.map.setCenter(this.props.userLocation)
    }
  }

  componentWillUnmount() {
    this.markers.forEach((marker) => {
      window.google.maps.event.clearListeners(marker, "click")
      window.google.maps.event.clearListeners(marker, "mouseover")
    })
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


