import UserRow from "./UserRow";

function UsersTable({ users, openDeleteModal }) {
  return (
    <div className="users-table-wrapper">
      <table className="users-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Full Name</th>
            <th>Username</th>
            <th>Role</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, index) => (
            <UserRow key={user.id} user={user} index={index} openDeleteModal={openDeleteModal} />
          ))}
        </tbody>
      </table>

      <div className="table-footer">
        <p>
          Showing 1 to {users.length} of {users.length} users
        </p>

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
    </div>
  );
}

export default UsersTable;
