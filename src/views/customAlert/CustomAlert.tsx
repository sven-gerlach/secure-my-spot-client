import React, { Component } from "react";
import { Alert } from "react-bootstrap";

interface IProps {
  variant: string,
  heading: string,
  message: string,
  dequeueAlert: () => undefined
}

interface IState {
  isAlertDisplayed: boolean
}


class CustomAlert extends Component<IProps, IState> {
  // number doesn't work even though setTimeout clearly returns a number
  timeoutID: any

  constructor(props: IProps) {
    super(props);
    this.state = {
      isAlertDisplayed: true
    }
    this.timeoutID = null
  }
  componentDidMount() {
    const timeoutID: ReturnType<typeof setTimeout> = setTimeout(this.handleClose, 5 * 1000)
    this.timeoutID = timeoutID
  }

  handleClose = () => {
    this.setState({isAlertDisplayed: false})
  }

  componentWillUnmount() {
    this.props.dequeueAlert();
    clearTimeout(this.timeoutID)
  }

  render() {
    const { variant, heading, message } = this.props
    return (
      <>
        <Alert
          show={this.state.isAlertDisplayed}
          variant={variant}
          dismissible={true}
          transition={true}
          onClose={this.handleClose}
        >
          <Alert.Heading>{heading}</Alert.Heading>
          <p>{message}</p>
        </Alert>
      </>
    )
  }
}

export default CustomAlert
