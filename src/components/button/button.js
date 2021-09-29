import React, { Component } from "react"

class Button extends Component {
  render() {
    let text = this.props.text
    return (
      <button
        type="button">
        {text}
      </button>
    )
  }
}

export default Button
