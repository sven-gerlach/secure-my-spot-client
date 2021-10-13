import React, {Component} from "react";

const token = process.env.REACT_APP_SESSION_ENCRYPTION_KEY
console.log(token)

class Map extends Component {

  render() {
    return (
      <p>[Map]</p>
    )
  }
}

export default Map
