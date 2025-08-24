import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { sendTeamInvite } from "../api/user";
import {
  getOutgoingTeamInvites,
  addProjectToTeam,
  removeMember,
  leaveTeam,
} from "../api/team";
import "./Team.css";
import { useAuth } from "../context/AuthContext";

function Team() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { team: initialTeam } = location.state || {};
  const [team, setTeam] = useState(initialTeam);
  const [invitedIds, setInvitedIds] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    techStack: "",
    githubRepo: "",
    liveDemo: "",
  });

  const teamId = team?._id;
  const isValidTeam = !!teamId;
  const isAdmin = team?.admin?._id === user?._id;

  // Fetch outgoing invites for this team
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

  // Handle sending invites
  const handleInvite = async (friendId) => {
    try {
      await sendTeamInvite(teamId, friendId);
      setInvitedIds((prev) => [...prev, friendId]);
      alert("Invite sent successfully!");
    } catch (err) {
      console.error("Invite failed:", err);
      alert(err.message || "Failed to send invite");
    }
  };

  // Handle adding a project
  const handleAddProject = async (e) => {
    e.preventDefault();
    const { title, description, techStack } = projectData;

    if (!title.trim() || !description.trim() || !techStack.trim()) {
      alert("Title, description, and tech stack are required.");
      return;
    }

    try {
      const newProject = await addProjectToTeam(teamId, {
        ...projectData,
        techStack: projectData.techStack.split(",").map((t) => t.trim()),
      });

      setTeam((prev) => ({
        ...prev,
        projects: [...(prev.projects || []), newProject],
      }));

      setProjectData({
        title: "",
        description: "",
        techStack: "",
        githubRepo: "",
        liveDemo: "",
      });
      setShowProjectForm(false);
      alert("Project added successfully!");
    } catch (err) {
      console.error("Add project failed:", err);
      alert(err.message || "Failed to add project");
    }
  };

  // Handle member removal (Admin only)
  const handleRemoveMember = async (memberId) => {
    try {
      await removeMember(teamId, memberId);
      setTeam((prev) => ({
        ...prev,
        members: prev.members.filter((m) => m._id !== memberId),
      }));
      alert("Member removed successfully!");
    } catch (err) {
      console.error("Remove member failed:", err);
      alert(err.message || "Failed to remove member");
    }
  };

  // Handle leaving team
  const handleLeaveTeam = async () => {
    try {
      await leaveTeam(teamId);
      alert("You have left the team");
      navigate("/my-team");
    } catch (err) {
      console.error("Leave team failed:", err);
      alert(err.message || "Failed to leave team");
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

  const teamMemberIds = team.members.map((m) => m._id);
  const eligibleFriends = user.friends.filter(
    (friend) =>
      !teamMemberIds.includes(friend._id) && !invitedIds.includes(friend._id)
  );

  return (
    <div className="team-page-container">
      {/* Team Overview */}
      <div className="team-header">
        <h2>{team.name}</h2>
        <p>{team.description || "No description provided."}</p>
      </div>

      {/* Projects Section */}
      <section className="projects-section">
        <div className="section-header">
          <h3>Projects</h3>
          {isAdmin && !showProjectForm && (
            <button
              className="primary-button"
              onClick={() => setShowProjectForm(true)}
            >
              ➕ Add Project
            </button>
          )}
        </div>

        {showProjectForm && (
          <form className="project-form" onSubmit={handleAddProject}>
            <input
              type="text"
              placeholder="Project Title"
              value={projectData.title}
              onChange={(e) =>
                setProjectData({ ...projectData, title: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Project Description"
              value={projectData.description}
              onChange={(e) =>
                setProjectData({ ...projectData, description: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Tech Stack (comma-separated)"
              value={projectData.techStack}
              onChange={(e) =>
                setProjectData({ ...projectData, techStack: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="GitHub Repo (optional)"
              value={projectData.githubRepo}
              onChange={(e) =>
                setProjectData({ ...projectData, githubRepo: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Live Demo URL (optional)"
              value={projectData.liveDemo}
              onChange={(e) =>
                setProjectData({ ...projectData, liveDemo: e.target.value })
              }
            />
            <div className="form-buttons">
              <button type="submit" className="primary-button">
                Add Project
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowProjectForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {team.projects?.length > 0 ? (
          <div className="projects-list">
            {team.projects.map((project) => (
              <div key={project._id} className="project-card">
                <h4>{project.title}</h4>
                <p>{project.description}</p>
                <p>
                  <strong>Tech Stack:</strong> {project.techStack.join(", ")}
                </p>
                <div className="project-links">
                  {project.githubRepo && (
                    <a
                      href={project.githubRepo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub Repo
                    </a>
                  )}
                  {project.liveDemo && (
                    <a
                      href={project.liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No projects added yet.</p>
        )}
      </section>

      {/* Members Section */}
      <section className="members-section">
        <h3>Team Members</h3>
        <ul className="members-list">
          {team.members.map((member) => (
            <li key={member._id} className="member-item">
              <div>
                <strong>{member.name}</strong> ({member.email})
              </div>
              {isAdmin && member._id !== user._id && (
                <button
                  onClick={() => handleRemoveMember(member._id)}
                  className="danger-button"
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Invite Friends Section */}
      {isAdmin && (
        <section className="invite-section">
          <h3>Invite Friends</h3>
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
                    className="primary-button"
                  >
                    Invite
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Actions */}
      <div className="team-buttons">
        <button className="danger-button" onClick={handleLeaveTeam}>
          Leave Team
        </button>
        <button
          className="secondary-button"
          onClick={() => navigate("/explore")}
        >
          Back to Explore
        </button>
      </div>
    </div>
  );
}

export default Team;
