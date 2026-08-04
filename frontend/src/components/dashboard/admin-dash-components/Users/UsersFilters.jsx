function UsersFilters({
  searchTerm,
  setSearchTerm,

  roleFilter,
  setRoleFilter,

  statusFilter,
  setStatusFilter,
}) {
  const role = localStorage.getItem("role");

  return (
    <div className="users-filters">
      <input
        type="text"
        placeholder={
          role === "warden" ? "Search students..." : "Search users..."
        }
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      />

      {role === "admin" && (
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
          }}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="warden">Warden</option>
          <option value="student">Student</option>
        </select>
      )}

      <select
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value);
        }}
      >
        <option value="">All Status</option>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>
    </div>
  );
}

export default UsersFilters;