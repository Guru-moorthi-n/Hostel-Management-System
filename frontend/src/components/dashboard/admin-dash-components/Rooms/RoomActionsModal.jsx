import React from "react";
import { useToast } from "../../../ToastContext";
import API from "../../../../config/api";

function RoomActionsModal({
  room,
  setShowModal,
  setShowRoomModal,
  setSelectedRoom,
  setShowDeleteModal,
  setShowViewStudentsModal,
}) {
  const { showToast } = useToast();

  return (
    <div className="modal-overlay">
      <div className="room-actions-modal">
        <h3>Room Actions</h3>

        <button
          onClick={() => {
            setShowModal(false);
            setShowViewStudentsModal(true);
          }}
        >
          <i className="fas fa-users"></i>
          View Students
        </button>

        <button
          onClick={async () => {
            const response = await fetch(
              `${API}/api/toggle-room-status/${room.id}`,
              {
                method: "PUT",
              },
            );

            const data = await response.json();
            if (data.success) {
              showToast("success", "Room Status Changed", "");

              setShowModal(false);

              setTimeout(() => {
                window.location.reload();
              }, 1200);
            } else {
              showToast("error", "Update Failed", "");
            }
          }}
        >
          <i className="fas fa-wrench"></i>

          {room.status === "maintenance"
            ? "Mark Available"
            : "Mark Maintenance"}
        </button>

        <button
          onClick={() => {
            setSelectedRoom(room);
            setShowModal(false);
            setShowRoomModal(true);
          }}
        >
          <i className="fas fa-pen"></i>
          Edit Room
        </button>

        <button
          onClick={() => {
            setShowModal(false);
            setShowDeleteModal(true);
          }}
        >
          <i className="fas fa-trash"></i>
          Delete Room
        </button>

        <button
          className="cancel-room-btn"
          onClick={() => {
            setShowModal(false);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default RoomActionsModal;