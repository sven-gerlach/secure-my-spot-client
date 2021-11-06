/**
 * Testing the reservation summary page
 */

// import testing modules
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { parkingSpotFixture } from "../../../utils/fixtures";
import { getObjectFromStorage, storeObjectInStorage } from "../../../utils/storage";
import { MemoryRouter, Route } from "react-router-dom";

// import utils
import { cloneDeep } from "lodash";

// import components
import ReserveSummary from "./reserveSummary";

// mock getObjectFromStorage and storeObjectInStorage function that retrieve and store the considered parking spot
// from/to session storage
jest.mock("../../../utils/sessionStorage", () => ({
  getObjectFromStorage: jest.fn(),
  storeObjectInStorage: jest.fn()
}))

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
      <MemoryRouter initialEntries={[`/reserve/${parkingSpot1.id}`]}>
        <Route render={props => (
          <ReserveSummary
            availableParkingSpots={availableParkingSpots}
            {...props}
            enqueueNewAlert={jest.fn()}
          />
        )} />
        <Route path="/reserve" render={() => <h1>Reservation Page</h1>} />
        <Route path="/payment" render={() => <h1>Payment Page</h1>} />
      </MemoryRouter>
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

  test("If parking spot becomes unavailable a modal with a button is rendered, where clicking the button takes " +
    "the user back to the reservation view", () => {
    // remove parkingSpot1 from availableParkingSpots
    const availableParkingSpots = [
      sandboxParkingSpot2
    ]

    // re-render the view
    sandboxRerender(
      <MemoryRouter initialEntries={[`/reserve/${sandboxParkingSpot1.id}`]}>
        <Route render={props => (
          <ReserveSummary
            availableParkingSpots={availableParkingSpots}
            history={props.history}
          />
        )} />
        <Route path="/reserve" render={() => <h1>Reservation Page</h1>} />
        <Route path="/payment" render={() => <h1>Payment Page</h1>} />
      </MemoryRouter>
    )

    // assert that the screen has a button with text "Find Alternative Parking"
    expect(screen.getByRole("button", { name: "Find Alternative Parking" })).toBeInTheDocument()

    // click the button
    userEvent.click(screen.getByRole("button", { name: "Find Alternative Parking"}))

    // assert that pressing the rendered button will redirect the user to the /reserve route
    expect(screen.getByText("Reservation Page")).toBeInTheDocument()
  })

  test("If parking spot details change (e.g. rate) then this change renders to the DOM and the custom alert " +
    "function is invoked", () => {
    // parking spot rates
    const oldParkingSpot1Rate = sandboxParkingSpot1.rate
    const newParkingSpot1Rate = oldParkingSpot1Rate === "20.00" ? "30.00" : "20.00"

    // create new parkingSpot1
    const newParkingSpot1 = cloneDeep(sandboxParkingSpot1)
    newParkingSpot1.rate = newParkingSpot1Rate

    // change parkingSpot1 details
    const availableParkingSpots = [
      newParkingSpot1,
      sandboxParkingSpot2
    ]

    // Create mock function for enqueueNewAlert
    const enqueueNewAlertMock = jest.fn()

    // mock storeObjectInStorage
    storeObjectInStorage.mockImplementation(() => undefined)

    // rerender the component
    sandboxRerender(
      <MemoryRouter initialEntries={[`/reserve/${sandboxParkingSpot1.id}`]}>
        <Route render={props => (
          <ReserveSummary
            availableParkingSpots={availableParkingSpots}
            {...props}
            enqueueNewAlert={enqueueNewAlertMock}
          />
        )} />
        <Route path="/reserve" render={() => <h1>Reservation Page</h1>} />
        <Route path="/payment" render={() => <h1>Payment Page</h1>} />
      </MemoryRouter>
    )

    // assertions
    expect(`$${oldParkingSpot1Rate}`).not.toBe(newParkingSpot1Rate)
    expect(screen.getByText(`$${newParkingSpot1Rate}`)).toBeInTheDocument()
    expect(storeObjectInStorage).toHaveBeenCalled()
    expect(enqueueNewAlertMock).toHaveBeenCalled()
  })
})
