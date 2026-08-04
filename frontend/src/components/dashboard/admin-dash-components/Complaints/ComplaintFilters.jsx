function ComplaintFilters({
  searchTerm,
  setSearchTerm,

  statusFilter,
  setStatusFilter,

  priorityFilter,
  setPriorityFilter,

  categoryFilter,
  setCategoryFilter,

  resetFilters,
}) {
  return (
    <div className="complaints-filter-container">
      <input
        type="text"
        placeholder="Search complaints..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      />

      <select
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value);
        }}
      >
        <option value="">All Status</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Resolved">Resolved</option>
      </select>

      <select
        value={priorityFilter}
        onChange={(e) => {
          setPriorityFilter(e.target.value);
        }}
      >
        <option value="">All Priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Urgent">Urgent</option>
      </select>

      <select
        value={categoryFilter}
        onChange={(e) => {
          setCategoryFilter(e.target.value);
        }}
      >
        <option value="">All Category</option>
        <option value="Electrical">Electrical</option>
        <option value="Plumbing">Plumbing</option>
        <option value="Water">Water</option>
        <option value="WiFi">WiFi</option>
        <option value="Furniture">Furniture</option>
        <option value="Mess">Mess</option>
        <option value="Cleaning">Cleaning</option>
        <option value="Security">Security</option>
        <option value="Other">Other</option>
      </select>

      <button className="complaints-reset-btn" onClick={resetFilters}>
        Reset
      </button>
    </div>
  );
}

export default ComplaintFilters;
