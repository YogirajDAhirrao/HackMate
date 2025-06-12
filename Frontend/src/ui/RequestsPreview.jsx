import { useEffect, useState } from "react";
import { getIncomingRequests } from "../api/user";

function RequestsPreview() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getIncomingRequests(); // assumes it returns { requests: [...] }
        setRequests(res.requests || []);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="requests-preview">
      <div>
        <p>
          Requests Received:{" "}
          <span className="number-of-requests">{requests.length}</span>
        </p>
      </div>
    </div>
  );
}

export default RequestsPreview;
