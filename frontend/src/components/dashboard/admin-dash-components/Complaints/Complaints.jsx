import "./complaints.css";
import React, { useEffect, useState } from "react";
import ComplaintFilters from "./ComplaintFilters";
import ComplaintCard from "./ComplaintCard";
import ComplaintDetails from "./ComplaintDetails";
import DeleteComplaintModal from "./DeleteComplaintModal";
import AssignWardenModal from "./AssignWardenModal";
import API from "../../../../config/api";

function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    if (filteredComplaints.length === 0) {
      setSelectedComplaint(null);
      return;
    }

    const exists = filteredComplaints.find(
      (c) => c.id === selectedComplaint?.id,
    );

    if (!exists) {
      setSelectedComplaint(filteredComplaints[0]);
    }
  }, [searchTerm, statusFilter, priorityFilter, categoryFilter, complaints]);

  function resetFilters() {
    setSearchTerm("");
    setStatusFilter("");
    setPriorityFilter("");
    setCategoryFilter("");

    if (complaints.length > 0) {
      setSelectedComplaint(complaints[0]);
    }
  }

  async function fetchComplaints() {
    const response = await fetch(`${API}/api/complaints`);

    const data = await response.json();

    if (data.success) {
      setComplaints(data.complaints);

      if (data.complaints.length > 0) {
        setSelectedComplaint(data.complaints[0]);
      }
    }
  }

  async function updateComplaintStatus(id, status) {
    const response = await fetch(
      `${API}/api/complaints/status/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      },
    );

    const data = await response.json();
    return data.complaint;
  }

  async function handleDeleteComplaint() {
    if (!selectedComplaint) return;

    try {
      const response = await fetch(
        `${API}/api/complaints/${selectedComplaint.id}`,

        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (data.success) {
        setShowDeleteModal(false);
        await fetchComplaints();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleStatusUpdate = async (status) => {
    if (!selectedComplaint) return;

    try {
      await updateComplaintStatus(selectedComplaint.id, status);
      fetchComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (complaint.room_number || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "" || complaint.status === statusFilter;

    const matchesPriority =
      priorityFilter === "" || complaint.priority === priorityFilter;

    const matchesCategory =
      categoryFilter === "" || complaint.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  return (
    <div className="complaints-page">
      <div className="complaints-header">
        <div>
          <h1>Complaints</h1>

          <p>Manage and resolve student complaints</p>
        </div>
      </div>

      <ComplaintFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        resetFilters={resetFilters}
      />

      <div className="complaints-layout">
        <div className="complaints-list">
          {filteredComplaints.length === 0 ? (
            <div className="complaints-empty">
              <i className="fas fa-search"></i>

              <h3>No Complaints Found</h3>

              <p>Try changing the search or filters.</p>
            </div>
          ) : (
            filteredComplaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                selectedComplaint={selectedComplaint}
                setSelectedComplaint={setSelectedComplaint}
              />
            ))
          )}
        </div>

        <ComplaintDetails
          complaint={selectedComplaint}
          onStatusChange={handleStatusUpdate}
          onDelete={() => setShowDeleteModal(true)}
          onAssign={() => setShowAssignModal(true)}
        />
      </div>
      <DeleteComplaintModal
        show={showDeleteModal}
        setShow={setShowDeleteModal}
        handleDelete={handleDeleteComplaint}
      />

      <AssignWardenModal
        show={showAssignModal}
        setShow={setShowAssignModal}
        selectedComplaint={selectedComplaint}
        refreshComplaints={fetchComplaints}
      />
    </div>
  );
}

export default Complaints;
