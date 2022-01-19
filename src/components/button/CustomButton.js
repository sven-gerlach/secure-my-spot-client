// import library modules
import React, { Component } from "react"
import { Button } from "react-bootstrap";

/** Class representing a button
 * @param {attribute=string} variant - bootstrap variant
 * @param {attribute=sring} size - bootstrap size
 * @param {attribute=string} buttonText - the text represented on the button
 * @param {attribute=url} urlTarget - the url target redirected to upon clicking the button
 * @param {attribute=method} handleSubmit() - a method that handles the collection and submission of data
 */
class CustomButton extends Component {
  handleClick = (event) => {
    event.preventDefault()

    // if button has a handleSubmit function then invoke that function
    if (this.props.handleSubmit) {
      this.props.handleSubmit(event)
    }

    // if button has a urlTarget, then push that target onto the history
    if (this.props.urlTarget) {
      this.props.history.push(this.props.urlTarget)
    }
  }

  render() {
    const {
      variant="primary",
      size=undefined,
      type="button",
      buttonText="Click Me",
    } = this.props

    return (
      <Button
        variant={variant}
        size={size}
        onClick={this.handleClick}
        type={type}
      >
        {buttonText}
      </Button>
    )
  }
}

export default CustomButton
