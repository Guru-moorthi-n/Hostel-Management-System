import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../../config/api";

function ViewStudentsModal({ room, setShowViewStudentsModal }) {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    const response = await fetch(
      `${API}/api/room-students/${room.id}`,
    );

    const data = await response.json();
    if (data.success) {
      setStudents(data.students);
    }
  }

  async function removeStudent(userId) {
    const ok = window.confirm("Remove this student from room?");
    if (!ok) return;

    const response = await fetch(
      `${API}/api/remove-room-assignment`,

      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      },
    );

    const data = await response.json();
    alert(data.message);
    if (data.success) {
      fetchStudents();
    }
  }

  return (
    <div className="modal-overlay">
      <div className="room-form-modal">
        <h3>{room.room_number}</h3>

        <p>{students.length} Student(s)</p>

        <div className="room-student-list">
          {students.length === 0 ? (
            <p>No Students Assigned</p>
          ) : (
            students.map((student) => (
              <div className="room-student-card" key={student.id}>
                <div>
                  <h4>{student.full_name}</h4>
                  <p>{student.register_number}</p>
                  <p>
                    {student.department} • Year {student.year}
                  </p>
                </div>

                <div className="room-student-actions">
                  <button
                    className="view-profile-btn"
                    onClick={() => {
                      navigate(`/admin-dashboard/profile/${student.id}`);
                    }}
                  >
                    View Profile
                  </button>

                  <button
                    className="remove-room-btn-small"
                    onClick={() => removeStudent(student.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="room-form-actions">
          <button
            onClick={() => {
              setShowViewStudentsModal(false);
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewStudentsModal;