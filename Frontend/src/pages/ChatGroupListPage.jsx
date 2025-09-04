import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyTeam } from "../api/team";
import socket from "../config/socket"; // Import socket
import "./ChatGroupListPage.css";

function ChatGroupListPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const myTeams = await getMyTeam();
        setTeams(myTeams);
      } catch (err) {
        console.error("Failed to fetch teams:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleJoinAndNavigate = (teamId) => {
    socket.connect();
    socket.emit("join_room", teamId); // Join the chat room immediately
    navigate(`/chat/${teamId}`);
  };

  if (loading) {
    return <div className="loading">Loading your chat groups...</div>;
  }

  return (
    <div className="chat-groups-container">
      <h1 className="heading">Your Chat Groups</h1>

      {teams.length === 0 ? (
        <p className="no-groups">You are not part of any team yet.</p>
      ) : (
        <div className="chat-groups-grid">
          {teams.map((team) => (
            <div
              key={team._id}
              className="chat-group-card"
              onClick={() => handleJoinAndNavigate(team._id)}
            >
              <h2>{team.name}</h2>
              <p>{team.description || "No description available"}</p>
              <span>Members: {team.members.length}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatGroupListPage;
