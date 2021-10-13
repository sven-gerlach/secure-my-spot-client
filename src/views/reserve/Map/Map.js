import React, {Component} from "react";
import ReactMapGL from "react-map-gl"

// todo: React cannot read any env vars defined inside the dyno
// const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN


class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: 40.760551,
        longitude: -73.997561,
        zoom: 14,
        bearing: 0,
        pitch: 0
      }
    };
  }

  render() {
    return (
      <ReactMapGL
        {...this.state.viewport}
        width="100vw"
        height="100vh"
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onViewportChange={(viewport) => this.setState({ viewport })}
        mapboxApiAccessToken="pk.eyJ1Ijoic3ZlbmdlcmxhY2giLCJhIjoiY2t1b3p1bjAxNGgwODMxbzNpdmRxZHpxayJ9.XKYHiZs-lwZzw-i1r0QrGg"
      />
    )
  }
}

export default Map
