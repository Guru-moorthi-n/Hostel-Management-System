import "./users.css";
import { useEffect, useState } from "react";

import UsersHeader from "./UsersHeader";
import UsersFilters from "./UsersFilters";
import UsersTable from "./UsersTable";
import DeleteUserModal from "./DeleteUserModal";
import API from "../../../../config/api.js";
import { useToast } from "../../../ToastContext.jsx";

function Users() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const role = localStorage.getItem("role");
  const { showToast } = useToast();

  function openDeleteModal(user) {
    setSelectedUser(user);
    setShowDeleteModal(true);
  }

  async function handleDeleteUser(password) {
    try {
      const response = await fetch(`${API}/api/delete-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          admin_username: localStorage.getItem("username"),
          admin_password: password,
          target_user_id: selectedUser.id,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        showToast("success", data.message, "");
        return;
      }

      setUsers((previousUsers) =>
        previousUsers.filter((user) => user.id !== selectedUser.id),
      );

      showToast("success", data.message, "");

      setShowDeleteModal(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(`${API}/api/users`);

        const data = await response.json();

        if (data.success) {
          setUsers(data.users);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    if (role === "warden" && user.role !== "student") {
      return false;
    }
    
    const matchesSearch =
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "" || user.role === roleFilter;

    const matchesStatus =
      statusFilter === "" || String(user.is_active) === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <section className="users-page">
      <UsersHeader />

      <UsersFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <UsersTable users={filteredUsers} openDeleteModal={openDeleteModal} />

      {showDeleteModal && (
        <DeleteUserModal
          selectedUser={selectedUser}
          setShowDeleteModal={setShowDeleteModal}
          handleDeleteUser={handleDeleteUser}
        />
      )}
    </section>
  );
}

export default Users;