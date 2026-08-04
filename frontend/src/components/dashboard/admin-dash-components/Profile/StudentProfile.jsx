import "./profile.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import API from "../../../../config/api";

function StudentProfile() {
  const role = localStorage.getItem("role");
  const isStudent = role === "student";

  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [studentData, setStudentData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);

  useEffect(() => {
    async function fetchStudent() {
      try {
        const response = await fetch(`${API}/api/student/${id}`);
        const data = await response.json();
        if (data.success) {
          const formattedData = {
            ...data.student,
            dob: data.student.dob ? data.student.dob.split("T")[0] : "",
          };

          setStudentData(formattedData);
          setOriginalData(formattedData);

          const shouldEdit = searchParams.get("edit");
          if (shouldEdit === "true") {
            setEditMode(true);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    async function fetchAvailableRooms() {
      try {
        const response = await fetch(
          `${API}/api/available-rooms`,
        );

        const data = await response.json();

        if (data.success) {
          setAvailableRooms(data.rooms);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchStudent();
    fetchAvailableRooms();
  }, [id, searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSaveStudent = async () => {
    if (!studentData.register_number || !studentData.department) {
      alert("Complete student profile first");
      return;
    }
    try {
      const safeDob = studentData.dob || null;

      const response = await fetch(`${API}/api/student/save`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          user_id: studentData.id,
          register_number: studentData.register_number,
          email: studentData.email,
          department: studentData.department,
          dob: safeDob,
          year: studentData.year,
          gender: studentData.gender,
          phone: studentData.phone,
          parent_phone: studentData.parent_phone,
          address: studentData.address,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      if (studentData.room_id) {
        const roomResponse = await fetch(
          `${API}/api/assign-room`,

          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              user_id: studentData.id,
              room_id: studentData.room_id,
            }),
          },
        );

        const roomData = await roomResponse.json();

        if (!roomData.success) {
          alert("Room assignment failed");
          return;
        }
      }

      alert("Student saved successfully");
      window.location.reload();
      setOriginalData(studentData);
      setEditMode(false);
    } catch (error) {
      console.log(error);
    }
  };

  async function handleRemoveRoom() {
    const confirmRemove = window.confirm(
      "Remove this student from the current room?",
    );
    if (!confirmRemove) return;
    try {
      const response = await fetch(
        `${API}/api/remove-room-assignment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            user_id: id,
          }),
        },
      );

      const data = await response.json();
      alert(data.message);

      if (data.success) {
        const refresh = await fetch(`${API}/api/student/${id}`);
        const result = await refresh.json();

        if (result.success) {
          setStudentData(result.student);
          setOriginalData(result.student);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleEditProfile() {
    setEditMode(true);
  }

  function handleViewFees() {
    navigate("/admin-dashboard/fees");
  }

  if (!studentData) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="student-profile-page">
      <div className="profile-page-header">
        <div>
          <h1>
            {studentData.role === "admin"
              ? "Admin"
              : studentData.role === "warden"
                ? "Warden"
                : "Student"}{" "}
            Profile
          </h1>

          <p>
            View and manage{" "}
            {studentData.role === "admin"
              ? "admin"
              : studentData.role === "warden"
                ? "warden"
                : "student"}{" "}
            information
          </p>
        </div>

        <div className="profile-header-buttons">
          <button
            className="back-btn"
            onClick={() => {
              navigate(-1);
            }}
          >
            <i className="fas fa-arrow-left"></i>
            Go Back
          </button>

          {!isStudent && !editMode && (
            <button
              className="edit-profile-btn"
              onClick={() => {
                setEditMode(true);
              }}
            >
              <i className="fas fa-pen"></i>
              Edit Profile
            </button>
          )}

          {editMode && (
            <button
              className="cancel-edit-btn"
              onClick={() => {
                setStudentData(originalData);
                setEditMode(false);
              }}
            >
              <i className="fas fa-times"></i>
              Cancel Edit
            </button>
          )}

          {editMode && (
            <button className="save-profile-btn" onClick={handleSaveStudent}>
              <i className="fas fa-save"></i>
              Save Changes
            </button>
          )}
        </div>
      </div>

      <div className="profile-hero-card">
        <div className="profile-avatars">
          {studentData.full_name
            ? studentData.full_name.charAt(0).toUpperCase()
            : "?"}
        </div>

        <div className="profile-main-details">
          <div className="name-status">
            <h2>{studentData.full_name}</h2>

            <span
              className={
                studentData.is_active ? "active-badge" : "inactive-badge"
              }
            >
              {studentData.is_active ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="profile-short-info">
            <div className="short-info-item">
              <i className="fas fa-user"></i>

              <div>
                <small>Username</small>
                <p>{studentData.username}</p>
              </div>
            </div>

            <div className="short-info-item">
              <i className="fas fa-graduation-cap"></i>

              <div>
                <small>Role</small>
                <p>{studentData.role}</p>
              </div>
            </div>

            <div className="short-info-item">
              <i className="fas fa-id-card"></i>

              <div>
                <small>User ID</small>
                <p>#{studentData.id}</p>
              </div>
            </div>

            <div className="short-info-item">
              <i className="fas fa-calendar"></i>

              <div>
                <small>Member Since</small>
                <p>
                  {new Date(studentData.created_at).toLocaleDateString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content-grid">
        <div className="profile-left-section">
          <div className="profile-card">
            <h3>
              <i className="fas fa-user-graduate"></i>
              {studentData.role === "admin"
                ? "Admin"
                : studentData.role === "warden"
                  ? "Warden"
                  : "Student"}{" "}
              Information
            </h3>

            <div className="profile-form-grid">
              <div className="form-group">
                <label>Register Number</label>
                <input
                  name="register_number"
                  value={studentData.register_number || ""}
                  readOnly={!editMode}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  name="email"
                  value={studentData.email || ""}
                  readOnly={!editMode}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Department</label>
                <input
                  name="department"
                  value={studentData.department || ""}
                  readOnly={!editMode}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={studentData.dob || ""}
                  disabled={!editMode}
                  onChange={handleInputChange}
                  className="date-input"
                />
              </div>

              <div className="form-group">
                <label>Year</label>

                <select
                  name="year"
                  value={studentData.year || ""}
                  disabled={!editMode}
                  onChange={handleInputChange}
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                  <option value="5">5th Year</option>
                </select>
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={studentData.gender || ""}
                  disabled={!editMode}
                  onChange={handleInputChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  name="phone"
                  value={studentData.phone || ""}
                  readOnly={!editMode}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Parent Contact</label>
                <input
                  name="parent_phone"
                  value={studentData.parent_phone || ""}
                  readOnly={!editMode}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group form-address">
                <label>Address</label>
                <textarea
                  name="address"
                  value={studentData.address || ""}
                  readOnly={!editMode}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="room-section">
              <h3>
                <i className="fas fa-bed"></i>
                Room Information
              </h3>

              <div className="current-room-grid">
                <div className="form-group">
                  <label>Current Room</label>

                  <input
                    value={studentData.room_number || "Not Assigned"}
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label>Block</label>

                  <input value={studentData.block || "Not Assigned"} readOnly />
                </div>

                <div className="form-group">
                  <label>Floor</label>

                  <input value={studentData.floor || "Not Assigned"} readOnly />
                </div>

                <div className="form-group">
                  <label>Status</label>

                  <input
                    value={studentData.room_status || "No Room"}
                    readOnly
                  />
                </div>
              </div>

              {!isStudent && (
                <div className="change-room-section">
                  <div className="form-group">
                    <label>Change Room</label>

                    <select
                      name="room_id"
                      value={studentData.room_id || ""}
                      disabled={!editMode || !studentData.register_number}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Available Room</option>

                      {availableRooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.room_number} ({room.occupancy}/{room.capacity})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {!studentData.register_number && (
                <small
                  style={{
                    color: "red",
                    marginTop: "10px",
                    display: "block",
                  }}
                >
                  Complete profile before assigning room.
                </small>
              )}

              {!isStudent && studentData.room_id && editMode && (
                <button className="remove-room-btn" onClick={handleRemoveRoom}>
                  <i className="fas fa-door-open"></i>
                  Remove From Room
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="profile-right-section">
          <div className="profile-card">
            <h3>
              <i className="fas fa-user"></i>
              Account Information
            </h3>

            <div className="profile-form-grid single-column">
              <div className="form-group">
                <label>Full Name</label>
                <input value={studentData.full_name || ""} readOnly={true} />
              </div>

              <div className="form-group">
                <label>Username</label>
                <input value={studentData.username || ""} readOnly={true} />
              </div>

              <div className="form-group">
                <label>Role</label>
                <input
                  value={
                    studentData.role === "admin"
                      ? "Admin"
                      : studentData.role === "warden"
                        ? "Warden"
                        : studentData.role === "student"
                          ? "Student"
                          : ""
                  }
                  readOnly={true}
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <input
                  value={studentData.is_active ? "Active" : "Inactive"}
                  readOnly={true}
                />
              </div>
            </div>
          </div>

          {!isStudent && (
            <div className="profile-card">
              <h3>
                <i className="fa fa-external-link"></i> Quick Actions
              </h3>

              <div className="quick-actions">
                <button onClick={handleEditProfile}>
                  Edit Student Profile
                  <i className="fas fa-arrow-right"></i>
                </button>

                <button disabled className="disabled-action-btn">
                  Change Room
                  <i className="fa fa-ban fa-not-allowed"></i>
                </button>

                <button onClick={handleViewFees}>
                  View Fee Details
                  <i className="fas fa-arrow-right"></i>
                </button>

                <button disabled className="disabled-action-btn">
                  View Attendance
                  <i className="fa fa-ban fa-not-allowed"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;