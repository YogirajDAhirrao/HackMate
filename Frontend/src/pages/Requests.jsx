import { useEffect, useState } from "react";
import {
  acceptRequest,
  getIncomingRequests,
  rejectRequests,
} from "../api/user";
import "./Requests.css";
import { useNavigate } from "react-router-dom";

function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null); // Track which request is being accepted
  const [rejectingId, setRejectingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getIncomingRequests();
        setRequests(res.requests || []);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (requestId) => {
    setAcceptingId(requestId);
    try {
      const res = await acceptRequest(requestId);
      console.log(res.message);
      alert(res.message);

      // Remove accepted request from the list
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err) {
      console.error("Accept failed:", err.message);
      alert(err.message);
    } finally {
      setAcceptingId(null);
    }
  };
  const handleReject = async (requestId) => {
    setRejectingId(requestId);
    try {
      const res = await rejectRequests(requestId);
      console.log(res.message);
      alert(res.message);
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err) {
      console.error("Accept failed:", err.message);
      alert(err.message);
    } finally {
      setAcceptingId(null);
    }
  };

  const handleClick = (slug) => {
    navigate(`/profile/${slug}`);
  };

  return (
    <div className="requests-page">
      <h2>Your Requests</h2>

      {loading ? (
        <p className="loading-text">Loading requests...</p>
      ) : (
        <div className="request-list">
          {requests.length === 0 ? (
            <p>No requests received.</p>
          ) : (
            requests.map((req) => (
              <div
                key={req._id}
                className="request-card"
                onClick={() => handleClick(req.slug)}
              >
                <div className="request-info">
                  <p>
                    <strong>Name:</strong> {req.name}
                  </p>
                  <p>
                    <strong>From:</strong> {req.email || req.github}
                  </p>
                </div>
                <button
                  className="accept-button"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent card click from navigating
                    handleAccept(req._id);
                  }}
                  disabled={acceptingId === req._id}
                >
                  {acceptingId === req._id ? "Accepting..." : "Accept"}
                </button>
                <button
                  className="reject-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReject(req._id);
                  }}
                  disabled={rejectingId === req._id}
                >
                  {rejectingId === req._id ? "Rejecting..." : "Reject"}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Requests;
