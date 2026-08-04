import { useState } from "react";

function DeleteUserModal({
  selectedUser,
  setShowDeleteModal,
  handleDeleteUser,
}) {
  const [adminPassword, setAdminPassword] = useState("");

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <h2>Delete User</h2>
        <p>
          Are you sure you want to delete
          <strong> {selectedUser.full_name}</strong> ?
        </p>{" "}
        <br></br>
        <p>Enter your password for confirmation.</p>
        <input
          type="password"
          placeholder="Enter your password"
          value={adminPassword}
          onChange={(e) => {
            setAdminPassword(e.target.value);
          }}
        />
        <div className="delete-modal-buttons">
          <button
            className="cancel-btn"
            onClick={() => {
              setAdminPassword("");
              setShowDeleteModal(false);
            }}
          >
            Cancel
          </button>

          <button
            className="confirm-delete-btn"
            disabled={!adminPassword.trim()}
            onClick={() => {
              handleDeleteUser(adminPassword);
            }}
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteUserModal;
