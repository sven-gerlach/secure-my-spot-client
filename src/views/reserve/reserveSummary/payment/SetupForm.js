import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
} from "react-bootstrap";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import urlHostnameClient from "../../../../httpRequests/urlConfigClient";


export default function SetupForm({ enqueueNewAlert }) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  useEffect(() => {
    handleShow()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: urlHostnameClient + "/reservations",
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Success");
    }

    setIsLoading(false);
  };

  return (
    <>
      <form id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" />
        <button disabled={isLoading || !stripe || !elements} id="submit">
          <span id="button-text">
            {isLoading ? <div className="spinner" id="spinner"></div> : "Submit"}
          </span>
        </button>
        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </form>
      {/* Modal that informs users which mock card details to use */}
      <Modal
        animation
        backdrop={"static"}
        centered={true}
        show={show}
        onHide={handleClose}
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Populate Card Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Please copy / paste the below card number to continue with your reservation. All other fields accept any mock data you like.
          <br/><br/>
          <b>4242-4242-4242-4242</b>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>Ok</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
