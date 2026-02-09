import { useState } from "react";
import api from "../api";

function AddPayment() {
  const [requestId, setRequestId] = useState("");
  const [flatId, setFlatId] = useState("");
  const [message, setMessage] = useState("");

  const submitPayment = () => {
    api.post("/payment/pay", {
      request_id: requestId,
      flat_id: flatId,
      payment_mode: "UPI"
    })
    .then(res => {
      setMessage(res.data.message);
    })
    .catch(err => {
      setMessage(
        err.response?.data?.message || "Payment failed"
      );
    });
  };

  return (
    <div>
      <h2>Pay Maintenance Request</h2>

      <input
        placeholder="Request ID"
        value={requestId}
        onChange={e => setRequestId(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Flat ID"
        value={flatId}
        onChange={e => setFlatId(e.target.value)}
      />
      <br /><br />

      <button onClick={submitPayment}>Pay</button>

      {message && <p>{message}</p>}
    </div>
  );
}

export default AddPayment;
