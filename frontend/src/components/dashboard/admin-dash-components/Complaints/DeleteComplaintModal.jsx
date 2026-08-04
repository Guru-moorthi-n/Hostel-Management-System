import "./complaints.css";

function DeleteComplaintModal({ show, setShow, handleDelete }) {
  if (!show) return null;

  return (
    <div className="Modal-overlay">
      <div className="delete-Modal">
        <h2>Delete Complaint</h2>

        <p>Are you sure you want to delete this complaint?</p>

        <div className="delete-Modal-actions">
          <button className="cancel-btn" onClick={() => setShow(false)}>
            Cancel
          </button>

          <button className="confirm-delete-btn" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteComplaintModal;
