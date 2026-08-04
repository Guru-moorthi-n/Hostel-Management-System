import { useState } from "react";
import "./AssignFeeModal.css";
import API from "../../../../config/api";

function AssignFeeModal({ students, feeStructure, onClose, onSuccess }) {
  const [studentId, setStudentId] = useState("");
  const [selectedFees, setSelectedFees] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [remarks, setRemarks] = useState("");

  function toggleFee(id) {
    if (selectedFees.includes(id)) {
      setSelectedFees(selectedFees.filter((fee) => fee !== id));
    } else {
      setSelectedFees([...selectedFees, id]);
    }
  }

  async function assignFees() {
    if (!studentId || selectedFees.length === 0) {
      alert("Select student and fees.");
      return;
    }

    const response = await fetch(
      `${API}/api/assign-fees`,

      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          student_id: studentId,
          fee_ids: selectedFees,
          due_date: dueDate,
          remarks,
        }),
      },
    );

    const data = await response.json();

    if (data.success) {
      onSuccess();
    } else {
      alert(data.message);
    }
  }

  return (
    <div className="assign-fee-overlay">
      <div className="assign-fee-modal">
        <h2>Assign Fees</h2>
        <label>Student</label>
        <select
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        >
          <option value="">Select Student</option>

          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>

        <label>Fee Types</label>

        <div className="fee-list">
          {feeStructure.map((fee) => (
            <label key={fee.id} className="fee-item">
              <div className="fee-left">
                <input
                  type="checkbox"
                  checked={selectedFees.includes(fee.id)}
                  onChange={() => toggleFee(fee.id)}
                />

                <span>{fee.fee_name}</span>
              </div>

              <span className="fee-price">
                ₹{Number(fee.default_amount).toLocaleString()}
              </span>
            </label>
          ))}
        </div>

        <label>Due Date</label>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <label>Remarks</label>

        <textarea
          rows="3"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />

        <div className="assign-actions">
          <button onClick={onClose}>Cancel</button>

          <button onClick={assignFees}>Assign Fees</button>
        </div>
      </div>
    </div>
  );
}

export default AssignFeeModal;
