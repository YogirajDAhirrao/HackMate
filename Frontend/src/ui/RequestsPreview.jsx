import { useEffect, useState } from "react";
import { getIncomingRequests } from "../api/user";
import { useNavigate } from "react-router-dom";

function RequestsPreview() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getIncomingRequests();
        setRequests(res.requests || []);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const handleClick = () => {
    if (requests.length > 0) {
      navigate("/requests");
    }
  };

  return (
    <div
      className="requests-preview"
      onClick={handleClick}
      style={{ cursor: requests.length > 0 ? "pointer" : "default" }}
    >
      <div>
        <p>
          Requests Received:{" "}
          <span className="number-of-requests">{requests.length}</span>
        </p>
        {requests.length === 0 && (
          <p style={{ fontSize: "0.9rem", color: "gray" }}>
            No incoming requests yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default RequestsPreview;
