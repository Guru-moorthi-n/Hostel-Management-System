import "./fees.css";

function PaymentHistory({ payments = [] }) {
  return (
    <div className="payment-history">
      <h3 className="fee-section-title">Payment History</h3>

      {payments.length === 0 ? (
        <div className="empty-history">No payments recorded.</div>
      ) : (
        payments.map((payment) => (
          <div key={payment.id} className="payment-history-card">
            <div className="payment-history-top">
              <h4>₹{Number(payment.amount).toLocaleString()}</h4>

              <span>{payment.payment_method}</span>
            </div>

            <div className="payment-history-body">
              <p>{new Date(payment.payment_date).toLocaleDateString()}</p>

              {payment.transaction_id && (
                <p>Transaction ID : {payment.transaction_id}</p>
              )}

              {payment.remarks && <p>{payment.remarks}</p>}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default PaymentHistory;
