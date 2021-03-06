// import React / Bootstrap
import React, { Component } from "react";

// import util functions
import { storeObjectInStorage } from "../../../utils/storage";
import { round, isEqual } from "lodash";

// import styles
import {
  MapDiv,
  SpinnerStyled
} from "./map.styles";
import { MarkerClusterer } from "@googlemaps/markerclusterer"
import parkingSign from "../../../assets/img/parking_sign_icon.png"
import { Button, Modal } from "react-bootstrap";

// todo: No api keys warning in deployed app
class Map extends Component {
  constructor(props) {
    super(props);
    this.map = null
    this.markers = []
    this.mapRef = React.createRef()
    this.newYorkMapBounds = {
      north: 40.86,
      south: 40.56,
      west: -74.21,
      east: -73.746,
    }
    this.newYorkDummyLocation = {
      lat: 40.76424,
      lng: -73.99079,
    }
    this.state = {
      showModal: false,
    }
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
        latLngBounds: {
          north: this.newYorkMapBounds.north,
          south: this.newYorkMapBounds.south,
          west: this.newYorkMapBounds.west,
          east: this.newYorkMapBounds.east,
        }
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
        if (this.isUserLocationInNewYork(location)) {
          myLocationMarker.setPosition(location);
        }
        else {
          // if user's location is not in New York create a Google Maps LatLng class of a New York position and impose
          // that instead. This is done to allow users not located in New York to still experience the map features and
          // the reservation flow
          const newYorkLocation = new window.google.maps.LatLng(
            this.newYorkDummyLocation.lat, this.newYorkDummyLocation.lng
          )
          myLocationMarker.setPosition(newYorkLocation)
        }
      })
      .catch(e => {
        console.error(e)
      })
  }

  /**
   * Returns true if the user's current GPS position is within the bounds of the New York map as stipulated by the
   * instance variable newYorkMapBounds
   * @param location
   * @return {boolean}
   */
  isUserLocationInNewYork(location) {
    // create LatLngBounds rectangle of New York map
    const southWestLatLng = new window.google.maps.LatLng(this.newYorkMapBounds.south, this.newYorkMapBounds.west)
    const northEastLatLng = new window.google.maps.LatLng(this.newYorkMapBounds.north, this.newYorkMapBounds.east)
    const newYorkMap = new window.google.maps.LatLngBounds(southWestLatLng, northEastLatLng)
    return newYorkMap.contains(location)
  }

  /**
   * creates markers, info windows, creates click event listeners, and eventually stores markers as an instance
   * attribute
   */
  createParkingSpots() {
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

      // create info-window
      const infoWindow = new window.google.maps.InfoWindow()

      // string content of info-window
      const htmlString = `
        <div>
          <p class="map-info-popup-text"><span>${round(parkingSpot.rate, 2).toFixed(2)}</span> ($ / hour)</p>
          <p class="map-info-popup-text">${round(parkingSpot.rate / 60, 2).toFixed(2)} ($ / min)</p>
          <button class="map-info-popup-button" id="reserve-button-${parkingSpot.id}">Reserve</button>
        </div>
      `

      // add event listener to marker
      window.google.maps.event.addListener(marker, "click", event => {
        // pan to parking spot
        this.map.panTo(event.latLng)
        // open the info window
        infoWindow.setContent(htmlString)
        infoWindow.open({
          anchor: marker,
          map: this.map,
          shouldFocus: true
        })
      })

      // add reserve button event listener -> clicking this button will redirect the user to the reservation summary
      // page and store the parkingSpot data in session storage such that a refresh on the reserve page can reload page
      // with stored parking spot data
      // https://dev.to/usaidpeerzada/adding-a-button-with-onclick-on-infowindow-google-maps-api-1ne6
      window.google.maps.event.addListener(infoWindow, "domready", () => {
        const reserveButton = document.getElementById(`reserve-button-${parkingSpot.id}`)
        if (reserveButton) {
          window.google.maps.event.addDomListener(reserveButton, "click", () => {
            // store parking spot data in session storage
            storeObjectInStorage(parkingSpot, "parkingSpot", "session")
            // redirect user to /reserve:id page
            const href = `reserve/${parkingSpot.id}`
            this.props.history.push(href)
          })
        }
      })

      // add click listener to map which closes the infoWindow and removes itself after one click
      window.google.maps.event.addListener(this.map, "click", () => {
        if (infoWindow) {
          infoWindow.close()
        }
      })

      this.markers.push(marker)
    }
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
          if (this.isUserLocationInNewYork(location)) {
            map.panTo(location);
          }
          else {
            const newYorkLocation = new window.google.maps.LatLng(
              this.newYorkDummyLocation.lat, this.newYorkDummyLocation.lng
            )
            map.panTo(newYorkLocation)
          }
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

    // retrieve all currently available parking spots only upon loading of the map from the api and store them in state
    // of the parent component. Do this repeatedly every 5 seconds to always ensure having the latest availability
    // displayed

    // create markerClusterer
    const map = this.map
    const markers = this.markers
    this.markerClusterer = new MarkerClusterer({ map, markers })

    if (this.props.availableParkingSpots) {
        this.createParkingSpots()
        // Add marker cluster to manage the markers
        this.markerClusterer.clearMarkers()
        this.markerClusterer.addMarkers(this.markers)
        this.markerClusterer.render()
      }

    // if user is not located in New York City display modal
    this.getMyLocation()
      .then(location => {
        if (!this.isUserLocationInNewYork(location)) {
          this.toggleModal()
        }
      })
  }

  componentDidUpdate = (prevProps) => {
    // set a marker for all available parking spots
    if (!isEqual(this.props.availableParkingSpots, prevProps.availableParkingSpots)) {
      // first clear all markers to prevent double-counting
      this.markers = []

      // then create markers with the new set of available parking spots retreieved from the api
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
    })
  }

  toggleModal = () => {
    this.setState( prevState => {
      return {showModal: !prevState.showModal}
    })
  }

  render() {
    return (
      <>
        <MapDiv ref={this.mapRef} />
        {this.props.isSpinnerDisplayed && (
          <SpinnerStyled animation="border" role="status" variant={"primary"}>
            <span className="visually-hidden">Loading...</span>
          </SpinnerStyled>
        )}

        {/* Modal: display alert that user is currently not located in New York */}
        <Modal
          show={this.state.showModal}
          backdrop={"static"}
          centered={true}
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Not in New York City?</Modal.Title>
          </Modal.Header>
          <Modal.Body>It would appear you are currently located outside of New York City. To allow you to browse the map and reserve available parking spots you have been allocated a dummy GPS location in New York City.</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.toggleModal}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }
}

export default Map
