import { useState } from "react";
import API from "../../../../config/api.js"

function RaiseComplaintModal({ onClose, refreshComplaints }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    priority: "Medium",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.category ||
      !formData.description.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/api/complaints`, {
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

      alert(data.message);

      if (data.success) {
        refreshComplaints();
        onClose();
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong.");
    }

    setLoading(false);
  }

  return (
    <div className="modal-overlay">
      <div className="student-modal">
        <div className="modal-header">
          <h2>Raise Complaint</h2>

          <button onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>

            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Complaint title"
            />
          </div>

          <div className="form-group">
            <label>Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>

              <option value="Electrical">Electrical</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Furniture">Furniture</option>
              <option value="Internet">Internet</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="form-group">
            <label>Priority</label>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              rows="5"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your complaint..."
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RaiseComplaintModal;