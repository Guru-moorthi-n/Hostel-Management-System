function FeeStudentRow({
  student,
  selectedStudent,
  setSelectedStudent,
}) {
  return (
    <tr
      className={selectedStudent?.id === student.id ? "selected-student" : ""}
      onClick={() => setSelectedStudent(student)}
    >
      <td>
        <div className="fee-student">
          <div className="fee-avatar">
            <i className="fas fa-user"></i>
          </div>

          <div>
            <h4>{student.name}</h4>

            <span>{student.regNo}</span>
          </div>
        </div>
      </td>

      <td>{student.room}</td>
      <td>₹{student.total.toLocaleString()}</td>
      <td>₹{student.paid.toLocaleString()}</td>
      <td>₹{student.balance.toLocaleString()}</td>

      <td>
        <span className={`fee-badge ${student.status.toLowerCase()}`}>
          {student.status}
        </span>
      </td>

      <td>
        <button className="fee-more-btn">
          <i className="fas fa-ellipsis-h"></i>
        </button>
      </td>
    </tr>
  );
}

export default FeeStudentRow;
