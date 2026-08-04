import RoomRow from "./RoomRow";

function RoomsTable({ rooms, fetchRooms, setShowRoomModal, setSelectedRoom }) {
  return (
    <>
      <div className="rooms-grid">
        {rooms.map((room) => (
          <RoomRow
            key={room.id}
            room={room}
            fetchRooms={fetchRooms}
            setShowRoomModal={setShowRoomModal}
            setSelectedRoom={setSelectedRoom}
          />
        ))}
      </div>

      <div className="rooms-footer">
        <p>Showing 1 to {rooms.length} rooms</p>

        <div className="pagination">
          <button>
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="active-page">1</button>
          <button>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </>
  );
}

export default RoomsTable;
