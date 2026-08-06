import { useState } from "react";
import API from "../../../../config/api";
import { useToast } from "../../../ToastContext";

function DeleteRoomModal({ room, setShowDeleteModal, fetchRooms }) {
  const [password, setPassword] = useState("");
  const adminUsername = localStorage.getItem("username");
  const { showToast } = useToast();

  async function handleDelete() {
    const response = await fetch(`${API}/api/delete-room`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        room_id: room.id,
        admin_username: adminUsername,
        admin_password: password,
      }),
    });

    const data = await response.json();
    showToast("success", data.message, "");

    if (data.success) {
      await fetchRooms();
      setShowDeleteModal(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="room-form-modal">
        <h3>Delete Room</h3>

        <p>
          Room :<b> {room.room_number}</b>
        </p>
        <p>This action cannot be undone.</p>

        <input
          type="password"
          placeholder="Enter Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="room-form-actions">
          <button onClick={() => setShowDeleteModal(false)}>Cancel</button>

          <button onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteRoomModal;