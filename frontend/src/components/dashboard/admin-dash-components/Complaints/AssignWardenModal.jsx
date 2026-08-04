import { useEffect, useState } from "react";
import "./complaints.css";
import API from "../../../../config/api";

function AssignWardenModal({
  show,
  setShow,
  selectedComplaint,
  refreshComplaints,
}) {
  const [wardens, setWardens] = useState([]);

  const [selectedWarden, setSelectedWarden] = useState("");

  useEffect(() => {
    if (show) {
      fetchWardens();
    }
  }, [show]);

  async function fetchWardens() {
    const response = await fetch(`${API}/api/wardens`);
    const data = await response.json();

    if (data.success) {
      setWardens(data.wardens);
    }
  }

  async function assignWarden() {
    if (!selectedWarden) return;

    await fetch(
      `${API}/api/complaints/assign/${selectedComplaint.id}`,

      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          wardenId: selectedWarden,
        }),
      },
    );
    setShow(false);
    refreshComplaints();
  }

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="assign-modal">
        <h2>Assign Warden</h2>

        <p className="assign-description">
          Select a warden to handle this complaint.
        </p>

        <select
          value={selectedWarden}
          onChange={(e) => {
            setSelectedWarden(e.target.value);
          }}
        >
          <option value="">Select Warden</option>

          {wardens.map((warden) => (
            <option key={warden.id} value={warden.id}>
              {warden.full_name}
            </option>
          ))}
        </select>

        <div className="assign-actions">
          <button className="cancel-btn" onClick={() => setShow(false)}>
            Cancel
          </button>

          <button className="primary-btn" onClick={assignWarden}>
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssignWardenModal;