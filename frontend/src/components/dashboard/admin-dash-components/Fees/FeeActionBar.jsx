function FeeActionBar({
  onReceivePayment,
  onEditFees,
}) {
  return (
    <div className="fee-action-bar">
      <button onClick={onReceivePayment}>
        <i className="fas fa-money-bill-wave"></i>

        <span>Receive Payment</span>
      </button>

      <button onClick={onEditFees}>
        <i className="fas fa-pen"></i>

        <span>Edit Fees</span>
      </button>
    </div>
  );
}

export default FeeActionBar;
