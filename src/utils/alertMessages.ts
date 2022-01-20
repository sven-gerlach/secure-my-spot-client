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
    "Successful Sign-Up",
    "Congratulation! You are signed up as well as signed in."
  ],
  successfulSignIn: [
    "success",
    "Successful Sign-In",
    "Welcome back. You are signed in."
  ],
  failedSignIn: [
    "warning",
    "Failed Authentication",
    "Wrong authentication details. Please try again.",
  ],
  successfulSignOut: [
    "success",
    "Successful Sign-Out",
    "You have been successfully signed out. Come back soon!"
  ],
  failedSignOut: [
    "warning",
    "Oops...",
    "Something went wrong. You are still signed in. Please try again."
  ],
  successfulChangePassword: [
    "success",
    "Successfully Changed Password",
    "You have successfully changed your password."
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
    "Reservation Found",
    "This reservation has been located and displayed."
  ],
  failedRetrievalAvailableSpots: [
    "warning",
    "Oops...",
    "Could not load currently available parking spots."
  ]
}

export default messages
