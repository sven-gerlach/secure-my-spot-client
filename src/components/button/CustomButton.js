// import library modules
import React, { Component } from "react"

/** Class representing a button
 * @param {attribute=string} buttonText - the text represented on the button
 * @param {attribute=url} urlTarget - the url target redirected to upon clicking the button
 * @param {attribute=method} handleSubmit() - a method that handles the collection and submission of data
 */
class CustomButton extends Component {
  handleClick = (event) => {
    event.preventDefault()
    const buttonText = event.target.innerHTML

    // button is either effecting redirection to another route or submitting data to the API
    if (buttonText === "Submit") {
      this.props.handleSubmit(event)
    }
    else {
      let target = this.props.urlTarget
      this.props.history.push(target)
    }
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

export default CustomButton
