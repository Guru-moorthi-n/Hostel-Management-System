import { useState } from "react";
import "../../dashboard.css";
import API from "../../../../config/api";
import { useToast } from "../../../ToastContext";

function ApplyLeaveModal({ onClose, refreshLeaves }) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    leave_type: "",
    from_date: "",
    to_date: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API}/api/leaves`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: localStorage.getItem("username"),
          ...formData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        refreshLeaves();
        onClose();
      } else {
        showToast("error", data.message, "");
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  }

  return (
    <div className="modal-overlay">
      <div className="student-modal">
        <div className="modal-header">
          <h2>Apply Leave</h2>

          <button onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Leave Type</label>

            <select
              name="leave_type"
              value={formData.leave_type}
              onChange={handleChange}
              required
            >
              <option value="">Select Leave Type</option>
              <option>Home Visit</option>
              <option>Medical Leave</option>
              <option>Emergency</option>
              <option>Personal</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>From Date</label>

            <input
              type="date"
              name="from_date"
              value={formData.from_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>To Date</label>

            <input
              type="date"
              name="to_date"
              value={formData.to_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Reason</label>

            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Leave"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplyLeaveModal;