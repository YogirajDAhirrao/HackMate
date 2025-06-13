import { useEffect, useState } from "react";
import { getIncomingRequests } from "../api/user";
import "./Requests.css";
import { useNavigate } from "react-router-dom";

function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getIncomingRequests();
        setRequests(res.requests || []);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false); // Hide loading after fetch (success or fail)
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = (requestId) => {
    console.log("Accepted request:", requestId);
    // TODO: Add accept request logic (API call + UI update)
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
                >
                  Accept
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
