/**
 * Module contains message object which stores all key message headings and bodies
 */

type message = [string, string, string]

interface IMessages {
  [key: string]: message
}

const messages: IMessages = {
  successfulSignUp: [
    "success",
    "Success",
    "Congratulations! Your account has been created. You are signed in."
  ],
  successfulSignIn: [
    "success",
    "Success",
    "Welcome back. You are signed in."
  ],
  failedSignIn: [
    "warning",
    "Failure",
    "Wrong authentication details. Please try again.",
  ],
  successfulSignOut: [
    "success",
    "Success",
    "You are signed out. We will miss you!"
  ],
  failedSignOut: [
    "warning",
    "Oops...",
    "Something went wrong. You are still signed in. Please try again."
  ],
  successfulChangePassword: [
    "success",
    "Success",
    "Your password has been changed."
  ],
  failedChangePassword: [
    "warning",
    "Oops...",
    "Something went wrong. Your password has not changed. Please try again."
  ],
  notFound404: [
    "warning",
    "Not Found",
    "This reservation does not exist"
  ],
  reservationFound: [
    "success",
    "Success",
    "Reservation has been found and displayed."
  ],
  failedRetrievalAvailableSpots: [
    "warning",
    "Oops...",
    "Could not load currently available parking spots."
  ],
  stripePaymentSuccess: [
    "success",
    "Success",
    "Your payment method has been securely stored and your reservation is confirmed."
  ],
  stripePaymentProcessing: [
    "warning",
    "Processing...",
    "The provided payment method is being processed. Your reservation will confirm after successful processing."
  ],
  stripePaymentFailure: [
    "warning",
    "Failed",
    "Please try again to register a valid payment method. Your reservation has not been confirmed."
  ],
  changeReservationTimeSuccess: [
    "success",
    "Success",
    "Your reservation has been amended."
  ],
  changeReservationTimeFailure: [
    "warning",
    "Failure",
    "Your reservation has not been amended."
  ],
  endReservationSuccess: [
    "success",
    "Success",
    "Your reservation has ended."
  ],
  endReservationFailure: [
    "warning",
    "Failure",
    "Your reservation could not be ended."
  ],
}

export default messages
