import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyTeam, leaveTeam, removeMember } from "../api/team";
import "./TeamInfo.css";
import { useNavigate } from "react-router-dom";

function TeamInfo() {
  const { user, setUser } = useAuth();

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState({}); // Track confirm per team

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTeams() {
      try {
        setLoading(true);
        const teamData = await getMyTeam();
        setTeams(teamData);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch team info. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchTeams();
  }, []);
  const handleOnclickRedirectToTeam = async (team) => {
    navigate("/team", { state: { team: team } });
  };
  const handleLeave = async (teamId) => {
    try {
      await leaveTeam(teamId);
      setUser({
        ...user,
        teams: user.teams.filter((id) => id !== teamId),
      });
      setTeams((prev) => prev.filter((team) => team._id !== teamId));
      setShowConfirm((prev) => ({ ...prev, [teamId]: false }));
    } catch (err) {
      console.error(err);
      setError("Failed to leave team. Please try again.");
    }
  };

  const handleRetry = () => {
    setError("");
    setLoading(true);
    async function fetchTeams() {
      try {
        const teamData = await getMyTeam();
        setTeams(teamData);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch team info. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchTeams();
  };

  const handleRedirectToProfile = (id, slug) => {
    if (id === user._id) {
      navigate("/myprofile");
    } else {
      navigate(`/profile/${slug}`);
    }
  };

  const handleRemoveMember = async (teamId, memberId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    try {
      await removeMember(teamId, memberId);
      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team._id === teamId
            ? {
                ...team,
                members: team.members.filter((m) => m._id !== memberId),
              }
            : team
        )
      );
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

  if (teams.length === 0) {
    return <div className="team-card">You are not part of any team.</div>;
  }

  return (
    <div className="teams-container">
      {teams.map((team) => {
        const isAdmin = team?.admin?._id === user?._id;

        return (
          <div
            key={team._id}
            className="team-card"
            onClick={() => handleOnclickRedirectToTeam(team)}
          >
            {team.logo && (
              <img
                src={team.logo}
                alt={`${team.name} logo`}
                className="team-logo"
              />
            )}
            <h2 className="team-name">{team.name}</h2>
            <p className="admin-label">
              Admin: <strong>{team.admin.name}</strong>
            </p>
            <div className="members">
              <h3 className="section-title">Members</h3>
              <ul
                className="member-list"
                aria-label="Team members"
                onClick={(e) => e.stopPropagation()}
              >
                {team.members.map((member) => (
                  <li
                    key={member._id}
                    className="member-item"
                    onClick={() =>
                      handleRedirectToProfile(member._id, member.slug)
                    }
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
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent profile redirect on button click
                          handleRemoveMember(team._id, member._id);
                        }}
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
              onClick={(e) => {
                e.stopPropagation();

                setShowConfirm((prev) => ({ ...prev, [team._id]: true }));
              }}
              aria-label="Leave team"
            >
              Leave Team
            </button>
            {showConfirm[team._id] && (
              <div className="confirm-dialog">
                <p>Are you sure you want to leave {team.name}?</p>
                <div className="confirm-buttons">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLeave(team._id);
                    }}
                    className="confirm-btn"
                    aria-label="Confirm leave team"
                  >
                    Yes, Leave
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowConfirm((prev) => ({
                        ...prev,
                        [team._id]: false,
                      }));
                    }}
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
      })}
    </div>
  );
}

export default TeamInfo;
