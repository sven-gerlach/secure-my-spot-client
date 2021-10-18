import React, { Component } from "react";
import { round, isEqual } from "lodash";
import { Redirect } from "react-router-dom";

// import styles
import MapDiv from "./map.styles";
import { getAllAvailableParkingSpots } from "../../../httpRequests/parkingSpots";
import { MarkerClusterer } from "@googlemaps/markerclusterer"
import parkingSign from "../../../assets/img/parking_sign_icon.png"


class Map extends Component {
  constructor(props) {
    super(props);
    this.map = null
    this.markers = []
    this.mapRef = React.createRef()
  }

  /**
   * Create the map and store it on the object so it is accessible from other methods
   */
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

  /**
   * Get the current user's location and return a resolved or rejected promise
   * @returns {Promise<unknown>}
   */
  getMyLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const location = new window.google.maps.LatLng(pos.coords.latitude, pos.coords.longitude)
          resolve(location);
        }, (error) => {
          reject(error)
        });
      }
      else {
        reject("Geo location data is not supported")
      }
    })
  }

  /**
   * Create the location marker, retrieve the user's location and set the location marker accordingly
   */
  createMyLocationMarker = () => {
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
    // retrieve user's current location and set location marker
    this.getMyLocation()
      .then((location) => {
        myLocationMarker.setPosition(location);
      })
      .catch(e => {
        console.error(e)
      })
  }

  /**
   * creates markers, info windows, creates click event listeners, and eventually stores markers as an instance
   * attribute
   */
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

  /**
   * Open info window when marker is clicked
   * @param marker
   * @param parkingSpot
   */
  openInfoWindow(marker, parkingSpot) {
    const htmlString = `
      <div>
        <p><b>Price ($/hr):</b>&nbsp;${round(parkingSpot.rate, 2).toFixed(2)}</p>
        <p><b>Price ($/min):</b>&nbsp;${round(parkingSpot.rate / 60, 2).toFixed(2)}</p>
        <button id="reserve-button">Reserve</button>
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

    // add reserve button event listener
    // https://dev.to/usaidpeerzada/adding-a-button-with-onclick-on-infowindow-google-maps-api-1ne6
    window.google.maps.event.addListener(infoWindow, "domready", () => {
      const reserveButton = document.getElementById("reserve-button")
      if (reserveButton) {
        window.google.maps.event.addDomListener(reserveButton, "click", () => {
          const href = `reserve/${parkingSpot.id}`
          this.props.history.push(href)
        })
      }
    })

    // add click listener to map which closes the infoWindow and removes itself after one click
    new window.google.maps.event.addListenerOnce(this.map, "click", () => {
      infoWindow.close()
    })
  }

  retrieveParkingSpotsFromAPI = () => {
    return new Promise((resolve, reject) => {
      getAllAvailableParkingSpots()
        .then(res => {
          this.props.setAvailableParkingSpots(res.data)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  /**
   * The myLocationControl adds a control to the map that centers the map on
   * the user's location. This constructor takes the control DIV as an argument.
   * @constructor
   */
  myLocationControl(myLocationControlDiv, map) {
    // Set CSS for the control border.
    const controlUI = document.createElement("div");

    controlUI.style.backgroundColor = "#fff";
    controlUI.style.border = "2px solid #fff";
    controlUI.style.borderRadius = "3px";
    controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    controlUI.style.cursor = "pointer";
    controlUI.style.marginTop = "8px";
    controlUI.style.marginBottom = "22px";
    controlUI.style.textAlign = "center";
    controlUI.title = "Click to center the map around my current location";
    myLocationControlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    const controlText = document.createElement("div");

    controlText.style.color = "rgb(25,25,25)";
    controlText.style.fontFamily = "Roboto,Arial,sans-serif";
    controlText.style.fontSize = "16px";
    controlText.style.lineHeight = "38px";
    controlText.style.paddingLeft = "5px";
    controlText.style.paddingRight = "5px";
    controlText.innerHTML = "My Location";
    controlUI.appendChild(controlText);
    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener("click", () => {
      this.getMyLocation()
        .then(location => {
          map.panTo(location);
        })
        .catch(e => console.error)
    });
  }

  componentDidMount() {
    // create the map
    this.createMap()

    // Create the DIV to hold the myLocation button control and call the CenterControl()
    // constructor passing in this DIV.
    const myLocationControlDiv = document.createElement("div");

    this.myLocationControl(myLocationControlDiv, this.map);
    this.map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(myLocationControlDiv);

    // create my location marker
    this.createMyLocationMarker()

    // create markerClusterer
    const map = this.map
    const markers = this.markers
    this.markerClusterer = new MarkerClusterer({ map, markers })

    // todo: panToBounds method with limits set by the set of most North, West, East, and South available spots
    // todo: clicking on a marker needs to cause the opening of a Info Window which displays the reservation price and a button to reserve

    // retrieve all currently available parking spots only upon loading of the map from the api and store them in state
    // of the parent component. Do this repeatedly every 5 seconds to always ensure having the latest availability
    // displayed
    this.retrieveParkingSpotsFromAPI()
      .then(() => {
        this.createParkingSpots()
        // Add marker cluster to manage the markers
        this.markerClusterer.clearMarkers()
        this.markerClusterer.addMarkers(this.markers)
        this.markerClusterer.render()
      })
    this.retrieveParkingSpotsIntervalID = setInterval(this.retrieveParkingSpotsFromAPI, 10000)
  }

  componentDidUpdate = (prevProps) => {
    // set a marker for all available parking spots
    console.log(this.props.availableParkingSpots)
    console.log(prevProps.availableParkingSpots)
    if (!isEqual(this.props.availableParkingSpots, prevProps.availableParkingSpots)) {
      this.createParkingSpots()

      // Add marker cluster to manage the markers
      this.markerClusterer.clearMarkers()
      this.markerClusterer.addMarkers(this.markers)
      this.markerClusterer.render()
    }

    // updates the map with the current user location; put this logic inside componentDidUpdate as opposed to Mount
    // since it is not possible to be 100% certain that the user location is determined by the time the Mount method is
    // invoked
    if (this.props.userLocation !== prevProps.userLocation) {
      this.map.setCenter(this.props.userLocation)
    }
  }

  componentWillUnmount() {
    this.markers.forEach((marker) => {
      window.google.maps.event.clearListeners(marker, "click")
      window.google.maps.event.clearListeners(marker, "mouseover")
      clearInterval(this.retrieveParkingSpotsIntervalID)
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


