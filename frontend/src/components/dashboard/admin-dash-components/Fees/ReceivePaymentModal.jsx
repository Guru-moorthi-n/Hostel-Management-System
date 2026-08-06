import { useState } from "react";
import "./ReceivePaymentModal.css";
import API from "../../../../config/api";
import { useToast } from "../../../ToastContext";

function ReceivePaymentModal({
  student,
  onClose,
  onSuccess,
}) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Cash");
  const [transactionId, setTransactionId] = useState("");
  const [remarks, setRemarks] = useState("");
  const { showToast } = useToast();

  async function receivePayment() {
    const response = await fetch(
      `${API}/api/receive-payment`,

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          student_id: student.student.id,
          amount,
          payment_method: method,
          transaction_id: transactionId,
          remarks,
        }),
      },
    );

    const data = await response.json();

    if (data.success) {
      onSuccess();
    } else {
      showToast("error", data.message, "");
    }
  }

  return (
    <div className="payment-overlay">
      <div className="payment-modal">
        <h2>Receive Payment</h2>

        <div className="payment-summary">
          <div>
            Student
            <strong>{student.student.full_name}</strong>
          </div>

          <div>
            Total
            <strong>₹{student.summary.total.toLocaleString()}</strong>
          </div>

          <div>
            Balance
            <strong>₹{student.summary.balance.toLocaleString()}</strong>
          </div>
        </div>

        <label>Amount</label>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <label>Payment Method</label>

        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option>Cash</option>

          <option>UPI</option>

          <option>Bank Transfer</option>
        </select>

        <label>Transaction ID</label>

        <input
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
        />

        <label>Remarks</label>

        <textarea
          rows="3"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />

        <div className="payment-actions">
          <button onClick={onClose}>Cancel</button>

          <button onClick={receivePayment}>Receive Payment</button>
        </div>
      </div>
    </div>
  );
}

export default ReceivePaymentModal;