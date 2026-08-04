import "./Rooms.css";
import { useEffect, useState } from "react";
import RoomsHeader from "./RoomsHeader";
import RoomsFilters from "./RoomsFilters";
import RoomsTable from "./RoomsTable";
import RoomFormModal from "./RoomFormModal";
import API from "../../../../config/api";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [blockFilter, setBlockFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [floorFilter, setFloorFilter] = useState("");
  const [showRoomModal, setShowRoomModal] = useState(false);

  const [selectedRoom, setSelectedRoom] = useState(null);

  async function fetchRooms() {
    try {
      const response = await fetch(`${API}/api/rooms`);
      const data = await response.json();

      if (data.success) {
        setRooms(data.rooms);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function resetFilters() {
    setSearchTerm("");
    setBlockFilter("");
    setFloorFilter("");
    setStatusFilter("");
  }

  useEffect(() => {
    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.room_number
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesBlock = blockFilter === "" || room.block === blockFilter;

    const matchesFloor =
      floorFilter === "" || room.floor.toString() === floorFilter;

    const matchesStatus = statusFilter === "" || room.status === statusFilter;

    return matchesSearch && matchesBlock && matchesFloor && matchesStatus;
  });

  return (
    <section className="rooms-page">
      <RoomsHeader rooms={rooms} setShowRoomModal={setShowRoomModal} setSelectedRoom={setSelectedRoom} />

      <RoomsFilters
        searchTerm={searchTerm}
        blockFilter={blockFilter}
        setBlockFilter={setBlockFilter}
        floorFilter={floorFilter}
        setFloorFilter={setFloorFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        setSearchTerm={setSearchTerm}
        resetFilters={resetFilters}
      />

      <RoomsTable
        rooms={filteredRooms}
        fetchRooms={fetchRooms}
        setShowRoomModal={setShowRoomModal}
        setSelectedRoom={setSelectedRoom}
      />

      {showRoomModal && (
        <RoomFormModal
          setShowModal={setShowRoomModal}
          selectedRoom={selectedRoom}
          fetchRooms={fetchRooms}
        />
      )}
    </section>
  );
}

export default Rooms;
