function FeeSummaryCards({ student }) {
  const summary = student?.summary;
  return (
    <div className="summary-grid">
      <div className="summary-card">
        <span>Paid Amount</span>
        <h2 className="paid">₹{summary?.paid.toLocaleString()}</h2>
      </div>

      <div className="summary-card">
        <span>Balance Amount</span>
        <h2 className="balance">₹{summary?.balance.toLocaleString()}</h2>
      </div>

      <div className="summary-card">
        <span>Status</span>

        <div className={`fee-badge ${summary?.status.toLowerCase()}`}>
          {summary?.status}
        </div>
      </div>

      <div className="summary-card">
        <span>Due Date</span>
        <h3>
          {student?.summary?.dueDate
            ? new Date(student.summary.dueDate).toLocaleDateString()
            : "--"}
        </h3>
      </div>
    </div>
  );
}

export default FeeSummaryCards;
