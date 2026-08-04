import React from "react";
import { useNavigate } from "react-router-dom";

function UserRow({ user, index, openDeleteModal }) {
  const firstLetter = user.full_name.charAt(0);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const dashboardRoute =
    role === "admin"
      ? "/admin-dashboard"
      : role === "warden"
        ? "/warden-dashboard"
        : "/student-dashboard";

  return (
    <tr>
      <td>{index + 1}</td>

      <td>
        <div className="user-name-cell">
          <div className="user-avatar">{firstLetter}</div>

          <span>{user.full_name}</span>
        </div>
      </td>

      <td>{user.username}</td>

      <td>
        <span className={`role-badge ${user.role}`}>
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </span>
      </td>

      <td>
        <span
          className={
            user.is_active ? "status-badge active" : "status-badge inactive"
          }
        >
          {user.is_active ? "Active" : "Inactive"}
        </span>
      </td>

      <td>{new Date(user.created_at).toLocaleDateString("en-IN")}</td>

      <td>
        <div className="action-buttons" title="Profile">
          <button
            className="profile-btn"
            onClick={() => {
              navigate(`${dashboardRoute}/profile/${user.id}`);
            }}
          >
            <i className="fas fa-user"></i>
          </button>

          <button
            className="edit-btn"
            title="Edit"
            onClick={() => {
              navigate(`${dashboardRoute}/profile/${user.id}?edit=true`);
            }}
          >
            <i className="fas fa-pen"></i>
          </button>

          {role === "admin" && (
            <button
              className="delete-btn"
              title="Delete"
              onClick={() => {
                openDeleteModal(user);
              }}
            >
              <i className="fas fa-trash"></i>
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export default UserRow;