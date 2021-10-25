/**
 * Testing the reservation summary page
 */

// import testing modules
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { parkingSpotFixture } from "../../../utils/fixtures";
import { getObjectFromStorage } from "../../../utils/sessionStorage";
import { BrowserRouter, Route } from "react-router-dom";

// import components
import ReserveSummary from "./reserveSummary";

// mock getObjectFromStorage function that retrieves the considered parking spot from session storage
jest.mock("../../utils/sessionStorage", () => ({ getObjectFromStorage: jest.fn() }))

// sandbox variable which needs to be accessed within test scopes
let sandboxParkingSpot1
let sandboxParkingSpot2
let sandboxRerender

describe("Test the reserve summary component", () => {
  beforeEach(() => {
    // mock available parking spots array
    const parkingSpot1 = parkingSpotFixture()
    const parkingSpot2 = parkingSpotFixture()
    const availableParkingSpots = [
      parkingSpot1,
      parkingSpot2
    ]

    // assign variables to global space so they can be read inside test scopes
    sandboxParkingSpot1 = parkingSpot1
    sandboxParkingSpot2 = parkingSpot2

    // mock getObjectFromStorage
    getObjectFromStorage.mockImplementation(() => parkingSpot1)

    // render the page
    const { rerender } = render(
      <BrowserRouter>
        <Route render={props => (
          <ReserveSummary
            availableParkingSpots={availableParkingSpots}
            history={props.history}
          />
        )} />
        <Route path="/reserve" render={() => <h1>Reservation Page</h1>} />
        <Route path="/payment" render={() => <h1>Payment Page</h1>} />
      </BrowserRouter>
    )

    //  assign rerender to sandbox variable
    sandboxRerender = rerender
  })

  test("Back button returns user to the map page", () => {
    // click on the back button
    userEvent.click(screen.getByRole("button", { name: "Back" }))

    // assertions
    expect(screen.getByText("Reservation Page")).toBeInTheDocument()
  })

  test("Payment button redirects user to the /payment route", () => {
    // click on the Payment button
    userEvent.click(screen.getByRole("button", { name: "Payment" }))

    // assertions
    expect(screen.getByText("Payment Page")).toBeInTheDocument()
  })

  test("If parking spot becomes unavailable a modal with text and one button is rendered to the DOM", () => {
    // remove parkingSpot1 from availableParkingSpots
    const availableParkingSpots = [
      sandboxParkingSpot2
    ]

    // re-render the view
    sandboxRerender(
      <BrowserRouter>
        <Route render={props => (
          <ReserveSummary
            availableParkingSpots={availableParkingSpots}
            history={props.history}
          />
        )} />
        <Route path="/reserve" render={() => <h1>Reservation Page</h1>} />
        <Route path="/payment" render={() => <h1>Payment Page</h1>} />
      </BrowserRouter>
    )

    // assert that the screen has a button with text "Find Alternative Parking"
    expect(screen.getByRole("button", { name: "Find Alternative Parking" })).toBeInTheDocument()
  })

  test("If parking spot details change (e.g. rate) then this change renders to the DOM", () => {
    // parking spot rates
    const oldParkingSpot1Rate = sandboxParkingSpot1.rate
    const newParkingSpot1Rate = oldParkingSpot1Rate === 20 ? 30 : 20

    // create new parkingSpot1
    sandboxParkingSpot1.rate = 20

    // change parkingSpot1 details
    const availableParkingSpots = [
      sandboxParkingSpot1,
      sandboxParkingSpot2
    ]

    // rerender the component
    sandboxRerender(
      <BrowserRouter>
        <Route render={props => (
          <ReserveSummary
            availableParkingSpots={availableParkingSpots}
            history={props.history}
          />
        )} />
        <Route path="/reserve" render={() => <h1>Reservation Page</h1>} />
        <Route path="/payment" render={() => <h1>Payment Page</h1>} />
      </BrowserRouter>
    )

    // assertions
    expect(oldParkingSpot1Rate).not.toBe(newParkingSpot1Rate)
    expect(screen.getByText(newParkingSpot1Rate)).toBeInTheDocument()
  })
})
