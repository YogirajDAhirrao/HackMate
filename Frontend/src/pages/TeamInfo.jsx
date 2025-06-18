import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyTeam, leaveTeam, removeMember } from "../api/team";
import "./TeamInfo.css";
import { useNavigate } from "react-router-dom";

function TeamInfo() {
  const { user, setUser } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const isAdmin = team?.admin?._id === user?._id;

  useEffect(() => {
    async function fetchTeam() {
      try {
        setLoading(true);
        const teamData = await getMyTeam();
        setTeam(teamData);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch team info. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchTeam();
  }, []);

  const handleLeave = async () => {
    try {
      await leaveTeam();
      setUser({ ...user, team: null });
      setTeam(null);
      setShowConfirm(false);
    } catch (err) {
      console.error(err);
      setError("Failed to leave team. Please try again.");
    }
  };

  const handleRetry = () => {
    setError("");
    setLoading(true);
    async function fetchTeam() {
      try {
        const teamData = await getMyTeam();
        setTeam(teamData);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch team info. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchTeam();
  };

  const handleRedirectToProfile = (id, slug) => {
    if (id === user._id) {
      navigate("/myprofile");
    } else {
      navigate(`/profile/${slug}`);
    }
  };
  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    try {
      await removeMember(memberId);
      setTeam((prev) => ({
        ...prev,
        members: prev.members.filter((m) => m._id !== memberId),
      }));
    } catch (err) {
      console.error(err);
      setError("Failed to remove member. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-card">
        <p>{error}</p>
        <button onClick={handleRetry} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  if (!team) {
    return <div className="team-card">You are not part of any team.</div>;
  }

  return (
    <div className="team-card">
      {team.logo && (
        <img src={team.logo} alt={`${team.name} logo`} className="team-logo" />
      )}
      <h2 className="team-name">{team.name}</h2>
      <p className="admin-label">
        Admin: <strong>{team.admin.name}</strong>
      </p>
      <div className="members">
        <h3 className="section-title">Members</h3>
        <ul className="member-list" aria-label="Team members">
          {team.members.map((member) => (
            <li
              key={member._id}
              className="member-item"
              onClick={() => handleRedirectToProfile(member._id, member.slug)}
            >
              <span>
                {member.name} ({member.email})
              </span>
              {member._id === team.admin._id && (
                <span className="badge" aria-label="Admin role">
                  Admin
                </span>
              )}
              {isAdmin && member._id !== team.admin._id && (
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveMember(member._id)}
                  aria-label={`Remove ${member.name}`}
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
      <button
        className="leave-btn"
        onClick={() => setShowConfirm(true)}
        aria-label="Leave team"
      >
        Leave Team
      </button>
      {showConfirm && (
        <div className="confirm-dialog">
          <p>Are you sure you want to leave {team.name}?</p>
          <div className="confirm-buttons">
            <button
              onClick={handleLeave}
              className="confirm-btn"
              aria-label="Confirm leave team"
            >
              Yes, Leave
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="cancel-btn"
              aria-label="Cancel leave team"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamInfo;
