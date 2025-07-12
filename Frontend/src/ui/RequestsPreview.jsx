import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getIncomingRequests } from "../api/user";
import { getIncomingTeamInvites } from "../api/team"; // Ensure this exists

import "./RequestsPreview.css";

function RequestsPreview() {
  const [friendRequests, setFriendRequests] = useState([]);
  const [teamInvites, setTeamInvites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const friendRes = await getIncomingRequests();
        const teamRes = await getIncomingTeamInvites();

        setFriendRequests(friendRes || []);
        setTeamInvites(teamRes || []);
      } catch (error) {
        console.error("Error fetching requests or invites:", error);
      }
    };

    fetchData();
  }, []);

  const handleClick = () => {
    if (friendRequests.length || teamInvites.length) {
      navigate("/requests");
    }
  };

  return (
    <div
      className="requests-preview-card"
      onClick={handleClick}
      style={{
        cursor:
          friendRequests.length > 0 || teamInvites.length > 0
            ? "pointer"
            : "default",
      }}
    >
      <h2 className="requests-title">Your Requests</h2>

      <div className="notification-section">
        <div className="notification-item">
          <span className="label">Friend Requests</span>
          <span
            className={`value ${
              friendRequests.length > 0 ? "highlight" : "dimmed"
            }`}
          >
            {friendRequests.length}
          </span>
        </div>

        <div className="notification-item">
          <span className="label">Team Invites</span>
          <span
            className={`value ${
              teamInvites.length > 0 ? "highlight" : "dimmed"
            }`}
          >
            {teamInvites.length}
          </span>
        </div>
      </div>

      {friendRequests.length === 0 && teamInvites.length === 0 && (
        <p className="empty-state">No requests or invites yet.</p>
      )}
    </div>
  );
}

export default RequestsPreview;
