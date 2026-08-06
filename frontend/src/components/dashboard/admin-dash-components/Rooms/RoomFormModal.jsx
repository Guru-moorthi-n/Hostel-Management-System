import { useState, useEffect } from "react";
import API from "../../../../config/api";
import { useToast } from "../../../ToastContext";

function RoomFormModal({
  setShowModal,
  selectedRoom,
  setSelectedRoom,
  fetchRooms,
}) {
  const [formData, setFormData] = useState({
    room_number: "",
    block: "A",
    floor: 1,
    capacity: 4,
    status: "available",
  });

  const isEditMode = selectedRoom !== null;
  const { showToast } = useToast();

  useEffect(() => {
    if (selectedRoom) {
      setFormData({
        room_number: selectedRoom.room_number,
        block: selectedRoom.block,
        floor: selectedRoom.floor,
        capacity: selectedRoom.capacity,
        status: selectedRoom.status,
      });
    }
  }, [selectedRoom]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSave() {
    const url = isEditMode
      ? `${API}/api/update-room/${selectedRoom.id}`
      : `${API}/api/add-room`;

    const method = isEditMode ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.success) {
      showToast("success", data.message, "");
      await fetchRooms();
      setSelectedRoom(null);
      setShowModal(false);
    } else {
      showToast("error", data.message, "");
    }
  }

  return (
    <div className="modal-overlay">
      <div className="room-form-modal">
        <h3>{isEditMode ? "Edit Room" : "Add New Room"}</h3>

        <input
          name="room_number"
          placeholder="Room Number"
          value={formData.room_number}
          onChange={handleChange}
        />

        <select name="block" value={formData.block} onChange={handleChange}>
          <option value="A">Block A</option>
          <option value="B">Block B</option>
          <option value="C">Block C</option>
          <option value="D">Block D</option>
        </select>

        <select name="floor" value={formData.floor} onChange={handleChange}>
          <option value="1">Floor 1</option>
          <option value="2">Floor 2</option>
          <option value="3">Floor 3</option>
          <option value="4">Floor 4</option>
        </select>

        <input
          name="capacity"
          type="number"
          value={formData.capacity}
          onChange={handleChange}
        />

        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="available">Available</option>
          <option value="maintenance">Maintenance</option>
        </select>

        <div className="room-form-actions">
          <button
            onClick={() => {
              setShowModal(false);
              setSelectedRoom(null);
            }}
          >
            Cancel
          </button>

          <button className="save-room-btn" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default RoomFormModal;
