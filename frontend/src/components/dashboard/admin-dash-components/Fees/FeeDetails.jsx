import FeeBreakdown from "./FeeBreakdown";
import FeeSummaryCards from "./FeeSummaryCards";
import PaymentHistory from "./PaymentHistory.jsx";
import FeeActionBar from "./FeeActionBar";

function FeeDetails({
  student,
  paymentHistory,
  clearSelection,
  onReceivePayment,
  onEditFees
}) {
  const info = student?.student;
  const summary = student?.summary;
  if (!student) {
    return (
      <div className="fee-details">
        <div className="fee-empty">
          <h3>Select a Student</h3>
          <p>Select a student from the table to view fee details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fee-details">
      <div className="fee-details-header">
        <div>
          <h2>Student Fee Details</h2>
        </div>

        <button className="close-details" onClick={clearSelection}>
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="student-info">
        <div className="student-avatar-large">
          <i className="fas fa-user"></i>
        </div>

        <div>
          <h3>{info.full_name}</h3>

          <p>
            {info.register_number}
            &nbsp; | &nbsp;
            {info.department}
            &nbsp; | &nbsp; Year {info.year}
            &nbsp; | &nbsp; Room {info.room_number || "--"}
          </p>
        </div>
      </div>

      <FeeBreakdown fees={student?.fees || []} />
      <FeeSummaryCards student={student} />
      <PaymentHistory payments={paymentHistory} />
      <FeeActionBar onReceivePayment={onReceivePayment} onEditFees={onEditFees} />
    </div>
  );
}

export default FeeDetails;