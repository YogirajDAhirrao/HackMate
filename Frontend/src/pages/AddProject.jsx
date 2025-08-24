import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addProjectToTeam } from "../api/team";
import "./AddProject.css";
function AddProject() {
  const { teamId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [liveDemo, setLiveDemo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await addProjectToTeam(teamId, {
        title,
        description,
        techStack: techStack.split(",").map((tech) => tech.trim()),
        githubRepo,
        liveDemo,
      });

      navigate(`/team/${teamId}`); // redirect back to team page
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-team-container">
      <h2 className="create-team-title">Add Project to Team</h2>
      <form onSubmit={handleSubmit} className="create-team-form">
        <label htmlFor="title">
          Project Title <span className="required">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter project title"
          className="input-field"
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your project"
          className="textarea-field"
        />

        <label htmlFor="techStack">Tech Stack (comma-separated)</label>
        <input
          id="techStack"
          type="text"
          value={techStack}
          onChange={(e) => setTechStack(e.target.value)}
          placeholder="React, Node.js, MongoDB"
          className="input-field"
        />

        <label htmlFor="githubRepo">GitHub Repo</label>
        <input
          id="githubRepo"
          type="url"
          value={githubRepo}
          onChange={(e) => setGithubRepo(e.target.value)}
          placeholder="https://github.com/user/project"
          className="input-field"
        />

        <label htmlFor="liveDemo">Live Demo</label>
        <input
          id="liveDemo"
          type="url"
          value={liveDemo}
          onChange={(e) => setLiveDemo(e.target.value)}
          placeholder="https://project-demo.com"
          className="input-field"
        />

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="create-team-btn" disabled={loading}>
          {loading ? "Adding Project..." : "Add Project"}
        </button>
      </form>
    </div>
  );
}

export default AddProject;
