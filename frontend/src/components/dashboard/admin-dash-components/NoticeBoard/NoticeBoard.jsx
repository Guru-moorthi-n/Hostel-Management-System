import { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";

import NoticeCard from "./NoticeCard";
import NoticeDetails from "./NoticeDetails";
import AddNoticeModal from "./AddNoticeModal";
import API from "../../../../config/api";

import "./notice.css";

function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editNotice, setEditNotice] = useState(null);
  const [deleteNotice, setDeleteNotice] = useState(null);

  async function fetchNotices() {
    try {
      const res = await fetch(`${API}/api/notices`);

      const data = await res.json();

      if (data.success) {
        setNotices(data.notices);

        if (data.notices.length > 0) {
          setSelectedNotice(data.notices[0]);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchNotices();
  }, []);

  const filteredNotices = useMemo(() => {
    if (filter === "Pinned") {
      return notices.filter((notice) => notice.is_pinned);
    }

    return notices;
  }, [filter, notices]);

  useEffect(() => {
    if (filteredNotices.length > 0) {
      setSelectedNotice(filteredNotices[0]);
    } else {
      setSelectedNotice(null);
    }
  }, [filter, notices]);

  return (
    <div className="notice-page">
      <div className="notice-header">
        <div>
          <h1>Notice Board</h1>

          <p>Stay updated with hostel announcements</p>
        </div>

        <button className="add-notice-btn" onClick={() => setShowModal(true)}>
          <FaPlus />
          Add Notice
        </button>
      </div>
      <div className="notice-tabs">
        <button
          className={filter === "All" ? "active" : ""}
          onClick={() => setFilter("All")}
        >
          All
        </button>

        <button
          className={filter === "Pinned" ? "active" : ""}
          onClick={() => setFilter("Pinned")}
        >
          Pinned
        </button>
      </div>
      <div className="notice-grid">
        {filteredNotices.map((notice) => (
          <NoticeCard
            key={notice.id}
            notice={notice}
            onClick={() => {
              setSelectedNotice(notice);
              setShowDetails(true);
            }}
          />
        ))}
      </div>
      {showDetails && (
        <NoticeDetails
          notice={selectedNotice}
          refresh={fetchNotices}
          onClose={() => setShowDetails(false)}
          onEdit={(notice) => {
            setShowDetails(false);
            setEditNotice(notice);
          }}
          onDelete={(notice) => {
            setShowDetails(false);
            setDeleteNotice(notice);
          }}
        />
      )}
      {showModal && (
        <AddNoticeModal
          onClose={() => setShowModal(false)}
          refresh={fetchNotices}
        />
      )}

      {editNotice && (
        <AddNoticeModal
          editNotice={editNotice}
          refresh={fetchNotices}
          onClose={() => setEditNotice(null)}
        />
      )}

      {deleteNotice && (
        <div className="Modal-overlay">
          <div className="delete-Modal">
            <h2>Delete Notice</h2>

            <p>
              Are you sure you want to delete
              <strong> {deleteNotice.title}</strong> ?
            </p>

            <div className="delete-Modal-actions">
              <button
                className="complaints-reset-btn"
                onClick={() => setDeleteNotice(null)}
              >
                Cancel
              </button>

              <button
                className="primary-btn"
                onClick={async () => {
                  await fetch(
                    `${API}/api/notices/${deleteNotice.id}`,
                    {
                      method: "DELETE",
                    },
                  );

                  setDeleteNotice(null);
                  fetchNotices();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NoticeBoard;