/**
 * Testing the reservation summary page
 */

// import testing modules
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createBrowserHistory } from "history";
import { parkingSpotFixture } from "../../utils/fixtures";
import { getObjectFromStorage } from "../../utils/sessionStorage";
import { BrowserRouter, Route } from "react-router-dom";

// import components
import ReserveSummary from "./reserveSummary";

// mock getObjectFromStorage function that retrieves the considered parking spot from session storage
jest.mock("../../utils/sessionStorage", () => ({ getObjectFromStorage: jest.fn() }))


describe("Test the reserve summary component", () => {
  beforeAll(() => {
    // mock available parking spots array
    const parkingSpot1 = parkingSpotFixture()
    const parkingSpot2 = parkingSpotFixture()
    const availableParkingSpots = [
      parkingSpot1,
      parkingSpot2
    ]

    // mock history object
    const history = createBrowserHistory()

    // mock getObjectFromStorage
    getObjectFromStorage.mockImplementation(() => parkingSpot1)

    // render the page
    render(
      <BrowserRouter>
        <ReserveSummary
          availableParkingSpots={availableParkingSpots}
          history={history}
        />
        <Route path="/reserve" render={() => <h1>Reservation Page</h1>} />
        <Route path="/payment" render={() => <h1>Payment Page</h1>} />
      </BrowserRouter>
    )
  })

  test("Back button returns user to the map page", () => {
    userEvent.click(screen.getByText("Back"))

    screen.debug()
    // assertions
    expect(screen.getByText("Reservation Page")).toBeInTheDocument()
  })

  test.todo("Payment button redirects user to the /payment route")

  test.todo("If current parking spot becomes unavailable a modal pops up with some text and one button that" +
    " sends the user back to the map page")
})
