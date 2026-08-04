import { useNavigate } from "react-router-dom";

function UsersHeader() {
  const navigate = useNavigate();

  return (
    <div className="users-header">
      <div>
        <h1>Users Management</h1>

        <p>Manage all system users and roles</p>
      </div>

      <button
        className="create-user-btn"
        onClick={() => navigate("/create-user")}
      >
        <i className="fas fa-plus"></i>
        Create User
      </button>
    </div>
  );
}

export default UsersHeader;
