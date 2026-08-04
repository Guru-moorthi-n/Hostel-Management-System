import { useEffect, useState } from "react";
import "./fees.css";

import FeeTabs from "./FeeTabs";
import FeeStudentTable from "./FeeStudentTable";
import FeeDetails from "./FeeDetails";
import AssignFeeModal from "./AssignFeeModal";
import ReceivePaymentModal from "./ReceivePaymentModal";
import EditFeesModal from "./EditFeesModal";
import API from "../../../../config/api";

function FeeManagement() {
  const [selectedTab, setSelectedTab] = useState("Pending");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [studentFeeDetails, setStudentFeeDetails] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 8;

  const [feeStructure, setFeeStructure] = useState([]);
  async function fetchStudents() {
    try {
      const response = await fetch(`${API}/api/fees`);

      const data = await response.json();

      if (data.success) {
        setStudents(data.students);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchFeeStructure() {
    try {
      const response = await fetch(`${API}/api/fee-structure`);
      const data = await response.json();
      if (data.success) {
        setFeeStructure(data.fees);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchStudentFeeDetails(studentId) {
    try {
      const response = await fetch(
        `${API}/api/student-fees/${studentId}`,
      );

      const data = await response.json();

      if (data.success) {
        setStudentFeeDetails(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchPaymentHistory(studentId) {
    try {
      const response = await fetch(
        `${API}/api/payment-history/${studentId}`,
      );

      const data = await response.json();

      if (data.success) {
        setPaymentHistory(data.payments);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchStudents();
    fetchFeeStructure();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      fetchStudentFeeDetails(selectedStudent.id);

      fetchPaymentHistory(selectedStudent.id);
    } else {
      setStudentFeeDetails(null);

      setPaymentHistory([]);
    }
  }, [selectedStudent]);

  const filteredStudents =
    selectedTab === "All"
      ? students
      : students.filter((student) => student.status === selectedTab);

  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;

  const paginatedStudents = filteredStudents.slice(
    startIndex,

    startIndex + rowsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab]);

  return (
    <div className="fee-page">
      <div className="fee-header">
        <div>
          <h1>Fee Management</h1>
          <p>Manage student fees and payment records</p>
        </div>

        <button
          className="add-fee-btn"
          onClick={() => setShowAssignModal(true)}
        >
          <i className="fas fa-plus"></i>
          Assign Fees
        </button>
      </div>

      <FeeTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      <div className="fee-main-layout">
        <FeeStudentTable
          students={paginatedStudents}
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          totalStudents={filteredStudents.length}
          setCurrentPage={setCurrentPage}
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
        />

        <FeeDetails
          student={studentFeeDetails}
          paymentHistory={paymentHistory}
          clearSelection={() => setSelectedStudent(null)}
          onReceivePayment={() => setShowPaymentModal(true)}
          onEditFees={() => setShowEditModal(true)}
        />
      </div>

      {showAssignModal && (
        <AssignFeeModal
          students={students}
          feeStructure={feeStructure}
          onClose={() => setShowAssignModal(false)}
          onSuccess={async () => {
            await fetchStudents();

            setSelectedStudent(null);

            setShowAssignModal(false);
          }}
        />
      )}

      {showPaymentModal && studentFeeDetails && (
        <ReceivePaymentModal
          student={studentFeeDetails}
          onClose={() => {
            setShowPaymentModal(false);
          }}
          onSuccess={async () => {
            await fetchStudents();

            await fetchStudentFeeDetails(selectedStudent.id);

            await fetchPaymentHistory(selectedStudent.id);

            setShowPaymentModal(false);
          }}
        />
      )}

      {showEditModal && studentFeeDetails && (
        <EditFeesModal
          student={studentFeeDetails}
          onClose={() => setShowEditModal(false)}
          onSuccess={async () => {
            await fetchStudents();

            await fetchStudentFeeDetails(selectedStudent.id);

            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
}

export default FeeManagement;
