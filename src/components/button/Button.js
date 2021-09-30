// import library modules
import React, { Component } from "react"
import { withRouter } from "react-router-dom";

class Button extends Component {
  handleClick = () => {
    let target = this.props.urlTarget
    this.props.history.push(target)
  }

  render() {
    let buttonText = this.props.buttonText
    return (
      <button
        onClick={this.handleClick}
        type="button">
        {buttonText}
      </button>
    )
  }
}

export default withRouter(Button)
