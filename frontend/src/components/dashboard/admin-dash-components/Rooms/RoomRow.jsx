import { useState } from "react";
import RoomActionsModal from "./RoomActionsModal";
import DeleteRoomModal from "./DeleteRoomModal";
import ViewStudentsModal from "./ViewStudentsModal";

function RoomRow({ room, fetchRooms, setShowRoomModal, setSelectedRoom }) {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewStudentsModal, setShowViewStudentsModal] = useState(false);

  const percentage = (room.occupancy / room.capacity) * 100;

  return (
    <>
      <div className="premium-room-card">
        <div className="room-card-header">
          <div>
            <h3>{room.room_number}</h3>

            <p>
              Block {room.block} • Floor {room.floor}
            </p>
          </div>

          <span className={`room-badge ${room.status}`}>{room.status}</span>
        </div>

        <div className="room-card-body">
          <div className="room-info-row">
            <span>Capacity</span>

            <span>{room.capacity} Beds</span>
          </div>

          <div className="room-info-row">
            <span>Occupancy</span>

            <span>
              {room.occupancy}/{room.capacity}
            </span>
          </div>

          <div className="progress-bar">
            <div
              className={`progress-fill ${room.status}`}
              style={{
                width: `${percentage}%`,
              }}
            ></div>
          </div>
        </div>

        <button
          className="room-action-btn"
          onClick={() => {
            setShowModal(true);
          }}
        >
          <i className="fas fa-ellipsis-h"></i>
        </button>
      </div>

      {showDeleteModal && (
        <DeleteRoomModal
          room={room}
          fetchRooms={fetchRooms}
          setShowDeleteModal={setShowDeleteModal}
        />
      )}

      {showModal && (
        <RoomActionsModal
          room={room}
          setShowModal={setShowModal}
          setShowRoomModal={setShowRoomModal}
          setSelectedRoom={setSelectedRoom}
          setShowDeleteModal={setShowDeleteModal}
          setShowViewStudentsModal={setShowViewStudentsModal}
        />
      )}

      {showViewStudentsModal && (
        <ViewStudentsModal
          room={room}
          setShowViewStudentsModal={setShowViewStudentsModal}
        />
      )}
    </>
  );
}

export default RoomRow;
