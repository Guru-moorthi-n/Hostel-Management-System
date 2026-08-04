function FeeBreakdown({ fees = [] }) {
  return (
    <>
      <h3 className="fee-section-title">Fee Breakdown</h3>

      <table className="breakdown-table">
        <thead>
          <tr>
            <th>Fee Type</th>

            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          {fees.map((fee) => (
            <tr key={fee.id}>
              <td>{fee.fee_name}</td>

              <td>₹{Number(fee.amount).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default FeeBreakdown;
