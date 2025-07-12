import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { sendTeamInvite } from "../api/user";
import { getOutgoingTeamInvites } from "../api/team";
import "./Team.css";
import { useAuth } from "../context/AuthContext";

function Team() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { team } = location.state || {};
  const [invitedIds, setInvitedIds] = useState([]);

  // Defensive check for _id presence
  const teamId = team?._id;
  const isValidTeam = !!teamId;

  useEffect(() => {
    if (!isValidTeam) return;

    const fetchOutgoingInvites = async () => {
      try {
        const invites = await getOutgoingTeamInvites();
        const thisTeamInvites = invites.filter(
          (invite) => invite.team?._id === teamId && invite.status === "pending"
        );
        setInvitedIds(thisTeamInvites.map((invite) => invite.to._id));
      } catch (err) {
        console.error("Failed to fetch invites:", err);
      }
    };

    fetchOutgoingInvites();
  }, [isValidTeam, teamId]);

  const handleInvite = async (friendId) => {
    try {
      await sendTeamInvite(teamId, friendId);
      setInvitedIds((prev) => [...prev, friendId]);
      alert("Invite sent successfully");
    } catch (err) {
      console.error("Invite failed:", err);
      alert(err.message || "Failed to send invite");
    }
  };

  if (!isValidTeam) {
    return (
      <div className="team-page-container">
        <p>
          ⚠️ Team data not found. Please access this page via My Teams or
          Explore.
        </p>
        <button className="back-button" onClick={() => navigate("/my-team")}>
          Back to My Teams
        </button>
      </div>
    );
  }

  const isAdmin = team.admin._id === user._id;
  const teamMemberIds = team.members.map((m) => m._id);
  const eligibleFriends = user.friends.filter(
    (friend) =>
      !teamMemberIds.includes(friend._id) && !invitedIds.includes(friend._id)
  );

  return (
    <div className="team-page-container">
      <h2>{team.name}</h2>
      <p>{team.description || "No description provided."}</p>

      <h3>Team Members</h3>
      <ul className="members-list">
        {team.members.map((member) => (
          <li key={member._id} className="member-item">
            <strong>{member.name}</strong> ({member.email})
          </li>
        ))}
      </ul>

      {isAdmin && (
        <>
          <h3>Invite Friends to Your Team</h3>
          {eligibleFriends.length === 0 ? (
            <p>No eligible friends to invite.</p>
          ) : (
            <div className="friends-list">
              {eligibleFriends.map((friend) => (
                <div key={friend._id} className="friend-card">
                  <div>
                    <p>
                      <strong>Name:</strong> {friend.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {friend.email}
                    </p>
                    <p>
                      <strong>GitHub:</strong>{" "}
                      {friend.github ? (
                        <a
                          href={friend.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {friend.github}
                        </a>
                      ) : (
                        "Not provided"
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => handleInvite(friend._id)}
                    className="invite-button"
                  >
                    Invite
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <button className="back-button" onClick={() => navigate("/explore")}>
        Back to Explore
      </button>
    </div>
  );
}

export default Team;
