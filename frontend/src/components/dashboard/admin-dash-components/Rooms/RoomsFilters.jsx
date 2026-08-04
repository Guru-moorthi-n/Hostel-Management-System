function RoomsFilters({
  searchTerm,
  setSearchTerm,

  blockFilter,
  setBlockFilter,

  floorFilter,
  setFloorFilter,

  statusFilter,
  setStatusFilter,

  resetFilters,
}) {
  return (
    <div className="rooms-filter-container">
      <input
        type="text"
        placeholder="Search by room number..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      />

      <select
        value={blockFilter}
        onChange={(e) => {
          setBlockFilter(e.target.value);
        }}
      >
        <option value="">All Blocks</option>
        <option value="A">Block A</option>
        <option value="B">Block B</option>
        <option value="C">Block C</option>
        <option value="D">Block D</option>
      </select>

      <select
        value={floorFilter}
        onChange={(e) => {
          setFloorFilter(e.target.value);
        }}
      >
        <option value="">All Floors</option>
        <option value="1">Floor 1</option>
        <option value="2">Floor 2</option>
        <option value="3">Floor 3</option>
        <option value="4">Floor 4</option>
      </select>

      <select
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value);
        }}
      >
        <option value="">All Status</option>
        <option value="available">Available</option>
        <option value="full">Full</option>
        <option value="maintenance">Maintenance</option>
      </select>

      <button className="reset-btn" onClick={resetFilters}>
        Reset
      </button>
    </div>
  );
}

export default RoomsFilters;
