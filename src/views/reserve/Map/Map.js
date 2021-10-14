import React, { Component } from "react";


class Map extends Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef()
  }

  componentDidMount() {
    new window.google.maps.Map(this.mapRef.current, {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    })
  }

  render() {
    const style = {
      width: "100%",
        height: "70%"
    }

    return (
      <div
        style={style}
        ref={this.mapRef}
      />
    )
  }
}

export default Map


