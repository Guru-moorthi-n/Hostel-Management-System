import "./notice.css";

function StudentNoticeModal({ notices, onClose, onNoticeClick }) {
  return (
    <div className="notice-overlay" onClick={onClose}>
      <div
        className="student-notice-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="student-notice-header">
          <div>
            <h2>All Notices</h2>

            <p>Hostel announcements and updates</p>
          </div>

          <button className="student-outline-btn" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="student-notice-list">
          {notices.length === 0 ? (
            <div className="student-empty">
              <i className="far fa-bell-slash"></i>

              <p>No notices available.</p>
            </div>
          ) : (
            notices.map((notice) => (
              <div
                key={notice.id}
                className={`student-notice-item ${
                  notice.is_pinned ? "pinned" : ""
                }`}
                onClick={() => onNoticeClick(notice)}
              >
                <div>
                  <div className="student-notice-title">
                    <h4>{notice.title}</h4>

                    {notice.is_pinned && <i className="fas fa-thumbtack"></i>}
                  </div>

                  <p>
                    {notice.description.length > 120
                      ? notice.description.substring(0, 120) + "..."
                      : notice.description}
                  </p>
                </div>

                <small>
                  {new Date(notice.created_at).toLocaleDateString("en-GB")}
                </small>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentNoticeModal;