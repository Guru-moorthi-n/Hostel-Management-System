import FeeStudentRow from "./FeeStudentRow";

function FeeStudentTable({
  students,
  currentPage,
  totalPages,
  rowsPerPage,
  totalStudents,
  setCurrentPage,
  selectedStudent,
  setSelectedStudent,
}) {
  return (
    <div className="fee-table-container">
      <table className="fee-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Room</th>
            <th>Total Fee</th>
            <th>Paid</th>
            <th>Balance</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <FeeStudentRow
              key={student.id}
              student={student}
              selectedStudent={selectedStudent}
              setSelectedStudent={setSelectedStudent}
            />
          ))}
        </tbody>
      </table>
      <div className="fee-table-footer">
        <p>
          Showing{" "}
          {totalStudents === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to{" "}
          {Math.min(
            currentPage * rowsPerPage,

            totalStudents,
          )}{" "}
          of {totalStudents} entries
        </p>

        <div className="fee-pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <i className="fas fa-angle-left"></i>
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={currentPage === index + 1 ? "active" : ""}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <i className="fas fa-angle-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeeStudentTable;
