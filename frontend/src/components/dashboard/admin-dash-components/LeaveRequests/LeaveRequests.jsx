import { useEffect, useMemo, useState } from "react";
import LeaveCard from "./LeaveCard";
import LeaveDetails from "./LeaveDetails";
import "./leave.css";
import API from "../../../../config/api";

function LeaveRequests() {
  const [leaves, setLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);

  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 6;

  async function fetchLeaves() {
    const res = await fetch(`${API}/api/leaves`);
    const data = await res.json();

    if (data.success) {
      setLeaves(data.leaves);

      if (data.leaves.length > 0) {
        setSelectedLeave(data.leaves[0]);
      }
    }
  }

  useEffect(() => {
    fetchLeaves();
  }, []);

  async function updateLeaveStatus(status) {
    if (!selectedLeave) return;

    const res = await fetch(
      `${API}/api/leaves/${selectedLeave.id}/status`,

      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          status,
        }),
      },
    );

    const data = await res.json();

    if (data.success) {
      fetchLeaves();
    }
  }

  const pendingCount = leaves.filter((x) => x.status === "Pending").length;
  const approvedCount = leaves.filter((x) => x.status === "Approved").length;
  const rejectedCount = leaves.filter((x) => x.status === "Rejected").length;

  const filteredLeaves = useMemo(() => {
    if (filter === "All") return leaves;

    return leaves.filter((x) => x.status === filter);
  }, [leaves, filter]);

  const totalPages = Math.ceil(filteredLeaves.length / rowsPerPage);

  const paginatedLeaves = filteredLeaves.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  useEffect(() => {
    if (filteredLeaves.length > 0) {
      setSelectedLeave(filteredLeaves[0]);
    } else {
      setSelectedLeave(null);
    }
  }, [filter, leaves]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  return (
    <div className="leave-page">
      <div className="leave-header">
        <div>
          <h1>Leave Requests</h1>

          <p>Review and manage student leave applications</p>
        </div>
      </div>

      <div className="leave-tabs">
        <button
          className={filter === "Pending" ? "active" : ""}
          onClick={() => setFilter("Pending")}
        >
          Pending ({pendingCount})
        </button>

        <button
          className={filter === "Approved" ? "active" : ""}
          onClick={() => setFilter("Approved")}
        >
          Approved ({approvedCount})
        </button>

        <button
          className={filter === "Rejected" ? "active" : ""}
          onClick={() => setFilter("Rejected")}
        >
          Rejected ({rejectedCount})
        </button>

        <button
          className={filter === "All" ? "active" : ""}
          onClick={() => setFilter("All")}
        >
          All ({leaves.length})
        </button>
      </div>

      <div className="leave-container">
        <div className="leave-left">
          <div className="leave-list">
            {paginatedLeaves.map((leave) => (
              <LeaveCard
                key={leave.id}
                leave={leave}
                selected={selectedLeave?.id === leave.id}
                onClick={() => setSelectedLeave(leave)}
              />
            ))}
          </div>
          <div className="leave-pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <i className="fas fa-angle-left"></i>
            </button>

            <span>
              Page {currentPage} of {totalPages || 1}
            </span>

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <i className="fas fa-angle-right"></i>
            </button>
          </div>
        </div>

        <LeaveDetails
          leave={selectedLeave}
          updateLeaveStatus={updateLeaveStatus}
        />
      </div>
    </div>
  );
}

export default LeaveRequests;