import { useState } from "react";
import api from "../api";

function AddPayment() {
  const [billId, setBillId] = useState("");
  const [amount, setAmount] = useState("");

  const submitPayment = () => {
    api.post("/payments", {
      bill_id: billId,
      amount: amount,
      payment_mode: "UPI"
    })
    .then(() => {
      alert("Payment added successfully. Trigger executed.");
      window.location.reload();
    })
    .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Add Payment</h2>
      <input
        placeholder="Bill ID"
        value={billId}
        onChange={e => setBillId(e.target.value)}
      />
      <br /><br />
      <input
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <br /><br />
      <button onClick={submitPayment}>Submit Payment</button>
    </div>
  );
}

export default AddPayment;
