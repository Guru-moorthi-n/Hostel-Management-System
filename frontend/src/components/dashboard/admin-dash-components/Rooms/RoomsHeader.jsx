function RoomsHeader({ rooms, setShowRoomModal, setSelectedRoom }) {
  const totalRooms = rooms.length;

  const availableRooms = rooms.filter(
    (room) => room.status === "available",
  ).length;

  const fullRooms = rooms.filter((room) => room.status === "full").length;

  const maintenanceRooms = rooms.filter(
    (room) => room.status === "maintenance",
  ).length;

  const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);

  return (
    <>
      <div className="rooms-page-title">
        <div>
          <h1>Rooms Management</h1>
          <p>Manage hostel rooms, capacity and availability</p>
        </div>

        <button
          className="add-room-btn"
          onClick={() => {
            setSelectedRoom(null); 
            setShowRoomModal(true);
          }}
        >
          <i className="fas fa-plus"></i> Add New Room
        </button>
      </div>

      <div className="rooms-stats">
        <div className="room-stat-card">
          <p>Total Rooms</p>
          <h2>{totalRooms}</h2>
        </div>

        <div className="room-stat-card available-card">
          <p>Available Rooms</p>
          <h2>{availableRooms}</h2>
        </div>

        <div className="room-stat-card occupied-card">
          <p>Occupied Rooms</p>
          <h2>{fullRooms}</h2>
        </div>

        <div className="room-stat-card maintenance-card">
          <p>Maintenance</p>
          <h2>{maintenanceRooms}</h2>
        </div>

        <div className="room-stat-card">
          <p>Total Capacity</p>
          <h2>{totalCapacity}</h2>
        </div>
      </div>
    </>
  );
}

export default RoomsHeader;
