import { useEffect, useState } from "react";
import { getIncomingRequests, acceptRequest, rejectRequest } from "../api/user";
import {
  getIncomingTeamInvites,
  getOutgoingTeamInvites,
  acceptTeamInvite,
  rejectTeamInvite,
} from "../api/team";
import { useNavigate } from "react-router-dom";
import "./Requests.css";

function Requests() {
  const [activeTab, setActiveTab] = useState("friend");
  const [friendRequests, setFriendRequests] = useState([]);
  const [incomingTeamInvites, setIncomingTeamInvites] = useState([]);
  const [outgoingTeamInvites, setOutgoingTeamInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [friends, incoming, outgoing] = await Promise.all([
          getIncomingRequests(),
          getIncomingTeamInvites(),
          getOutgoingTeamInvites(),
        ]);

        setFriendRequests(friends || []);
        setIncomingTeamInvites((incoming || []).filter((i) => i.team));
        setOutgoingTeamInvites((outgoing || []).filter((i) => i.team));
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleAccept = async (type, id) => {
    setProcessingId(id);
    try {
      if (type === "friend") {
        await acceptRequest(id);
        setFriendRequests((prev) => prev.filter((r) => r._id !== id));
      } else {
        await acceptTeamInvite(id);
        setIncomingTeamInvites((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (err) {
      alert(err.message || "Failed to accept");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (type, id) => {
    setProcessingId(id);
    try {
      if (type === "friend") {
        await rejectRequest(id);
        setFriendRequests((prev) => prev.filter((r) => r._id !== id));
      } else {
        await rejectTeamInvite(id);
        setIncomingTeamInvites((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (err) {
      alert(err.message || "Failed to reject");
    } finally {
      setProcessingId(null);
    }
  };

  const handleClick = (slug) => navigate(`/profile/${slug}`);
  const handleTeamClick = (slug) => navigate(`/teams/${slug}`);

  const renderCard = (req, type) => {
    const isTeam = type === "team";
    const from = req.from;
    const label = isTeam
      ? `Team Invite - ${req.team?.name || "Deleted Team"}`
      : "Friend Request";

    return (
      <div
        key={req._id}
        className="request-card"
        onClick={() => handleClick(from.slug)}
      >
        <div className="request-info">
          <p>
            <strong>{label}</strong>
          </p>
          <p>
            <strong>Name:</strong> {from.name}
          </p>
          <p>
            <strong>Email:</strong> {from.email}
          </p>
          {isTeam && (
            <p>
              <strong>Team:</strong>{" "}
              {req.team ? (
                req.team.name
              ) : (
                <span style={{ color: "red" }}>Deleted</span>
              )}
            </p>
          )}
        </div>
        <button
          className="accept-button"
          onClick={(e) => {
            e.stopPropagation();
            handleAccept(type, req._id);
          }}
          disabled={processingId === req._id}
        >
          {processingId === req._id ? "Accepting..." : "Accept"}
        </button>
        <button
          className="reject-button"
          onClick={(e) => {
            e.stopPropagation();
            handleReject(type, req._id);
          }}
          disabled={processingId === req._id}
        >
          {processingId === req._id ? "Rejecting..." : "Reject"}
        </button>
      </div>
    );
  };

  const renderOutgoingTeamInvite = (invite) => (
    <div
      key={invite._id}
      className="request-card"
      onClick={() => invite.team?.slug && handleTeamClick(invite.team.slug)}
    >
      <div className="request-info">
        <p>
          <strong>Invite Sent</strong>
        </p>
        <p>
          <strong>To:</strong> {invite.to.name} ({invite.to.email})
        </p>
        <p>
          <strong>Team:</strong>{" "}
          {invite.team ? (
            invite.team.name
          ) : (
            <span style={{ color: "red" }}>Deleted</span>
          )}
        </p>
      </div>
    </div>
  );

  return (
    <div className="requests-page">
      <h2>Your Requests</h2>

      <div className="tab-switcher">
        <button
          className={activeTab === "friend" ? "active" : ""}
          onClick={() => setActiveTab("friend")}
        >
          Friend Requests
        </button>
        <button
          className={activeTab === "team" ? "active" : ""}
          onClick={() => setActiveTab("team")}
        >
          Team Invites
        </button>
        <button
          className={activeTab === "sent" ? "active" : ""}
          onClick={() => setActiveTab("sent")}
        >
          Sent Invites
        </button>
      </div>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <div className="request-list">
          {activeTab === "friend" ? (
            friendRequests.length === 0 ? (
              <p>No friend requests received.</p>
            ) : (
              friendRequests.map((req) => renderCard(req, "friend"))
            )
          ) : activeTab === "team" ? (
            incomingTeamInvites.length === 0 ? (
              <p>No incoming team invites.</p>
            ) : (
              incomingTeamInvites.map((invite) => renderCard(invite, "team"))
            )
          ) : outgoingTeamInvites.length === 0 ? (
            <p>No outgoing team invites.</p>
          ) : (
            outgoingTeamInvites.map((invite) =>
              renderOutgoingTeamInvite(invite)
            )
          )}
        </div>
      )}
    </div>
  );
}

export default Requests;
