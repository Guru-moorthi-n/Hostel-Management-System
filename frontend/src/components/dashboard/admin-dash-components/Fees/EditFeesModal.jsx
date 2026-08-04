import { useEffect, useState } from "react";
import "./EditFeesModal.css";
import API from "../../../../config/api";

function EditFeesModal({
  student,
  onClose,
  onSuccess,
}) {
  const [fees, setFees] = useState([]);

  useEffect(() => {
    loadFees();
  }, []);

  async function loadFees() {
    const response = await fetch(
      `${API}/api/student-fees/edit/${student.student.id}`,
    );

    const data = await response.json();

    if (data.success) {
      setFees(data.fees);
    }
  }

  function updateField(index, field, value) {
    const updated = [...fees];

    updated[index][field] = value;

    setFees(updated);
  }

  async function removeFee(id) {
    if (!window.confirm("Remove this fee?")) return;

    await fetch(
      `${API}/api/student-fees/${id}`,

      {
        method: "DELETE",
      },
    );

    setFees(fees.filter((fee) => fee.id !== id));
  }

  async function saveChanges() {
    const response = await fetch(
      `${API}/api/student-fees/update`,

      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          fees,
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
    <div className="edit-fee-overlay">
      <div className="edit-fee-modal">
        <h2>Edit Assigned Fees</h2>

        {fees.map((fee, index) => (
          <div key={fee.id} className="edit-fee-card">
            <div className="edit-fee-header">
              <h3>{fee.fee_name}</h3>

              <button
                className="remove-fee-btn"
                onClick={() => removeFee(fee.id)}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>

            <label>Amount</label>

            <input
              type="number"
              value={fee.amount}
              onChange={(e) =>
                updateField(
                  index,

                  "amount",

                  e.target.value,
                )
              }
            />

            <label>Due Date</label>

            <input
              type="date"
              value={fee.due_date?.split("T")[0] || ""}
              onChange={(e) =>
                updateField(
                  index,

                  "due_date",

                  e.target.value,
                )
              }
            />

            <label>Remarks</label>

            <textarea
              value={fee.remarks || ""}
              onChange={(e) =>
                updateField(
                  index,

                  "remarks",

                  e.target.value,
                )
              }
            />
          </div>
        ))}

        <div className="edit-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={saveChanges}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export default EditFeesModal;
