import { useEffect, useState } from "react";
import "./notice.css";
import API from "../../../../config/api";
import { useToast } from "../../../ToastContext";

function AddNoticeModal({ onClose, refresh, editNotice = null }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "Announcement",
    is_pinned: false,
  });
  const { showToast } = useToast();

  useEffect(() => {
    if (editNotice) {
      setForm({
        title: editNotice.title,
        description: editNotice.description,
        type: editNotice.type,
        is_pinned: editNotice.is_pinned,
      });
    }
  }, [editNotice]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function saveNotice(e) {
    e.preventDefault();

    if (form.title.trim() === "" || form.description.trim() === "") {
      showToast("error", "Please fill all required fields.", "");
      return;
    }

    try {
      let url = `${API}/api/notices`;
      let method = "POST";

      if (editNotice) {
        url = `${API}/api/notices/${editNotice.id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        refresh();
        onClose();
      } else {
        showToast("error", data.message, "");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="Modal-overlay">
      <div className="notice-modal">
        <h2>{editNotice ? "Edit Notice" : "Add Notice"}</h2>

        <form onSubmit={saveNotice}>
          <div className="notice-form-group">
            <label>Title</label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter title"
            />
          </div>

          <div className="notice-form-group">
            <label>Type</label>

            <select name="type" value={form.type} onChange={handleChange}>
              <option>Announcement</option>
              <option>Fee</option>
              <option>Maintenance</option>
              <option>Event</option>
              <option>Emergency</option>
            </select>
          </div>

          <div className="notice-form-group">
            <label>Description</label>

            <textarea
              rows="6"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter notice description..."
            />
          </div>

          <div className="notice-checkbox">
            <input
              type="checkbox"
              id="pin"
              name="is_pinned"
              checked={form.is_pinned}
              onChange={handleChange}
            />

            <label htmlFor="pin">Pin this notice</label>
          </div>

          <div className="notice-modal-actions">
            <button
              type="button"
              className="complaints-reset-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="primary-btn">
              {editNotice ? "Update Notice" : "Add Notice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddNoticeModal;
