import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTeam } from "../api/team";
import "./CreateTeam.css";

function CreateTeam() {
  const navigate = useNavigate();

  // Team fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Project toggle + fields
  const [addProject, setAddProject] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [liveDemo, setLiveDemo] = useState("");

  // Error & loading state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation: Project title & description required if toggle enabled
    if (
      addProject &&
      (!projectTitle.trim() || !projectDescription.trim() || !techStack.trim())
    ) {
      setError(
        "Project title, description, and tech stack are required if adding a project."
      );
      setLoading(false);
      return;
    }

    try {
      const payload = { name, description };

      if (addProject) {
        payload.project = {
          title: projectTitle.trim(),
          description: projectDescription.trim(),
          techStack: techStack.split(",").map((tech) => tech.trim()),
          githubRepo,
          liveDemo,
        };
      }

      const teamResponse = await createTeam(payload);

      // Navigate based on project toggle
      if (addProject) {
        navigate("/team", { state: { team: teamResponse.team } });
      } else {
        navigate("/team", { state: { team: teamResponse.team } });
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-team-container">
      <h2 className="create-team-title">Create Your Team</h2>
      <form onSubmit={handleSubmit} className="create-team-form">
        <label htmlFor="name">
          Team Name <span className="required">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter team name"
          className="input-field"
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell us about your team"
          className="textarea-field"
        />

        {/* Toggle for adding project */}
        <div className="add-project-toggle">
          <label>
            <input
              type="checkbox"
              checked={addProject}
              onChange={(e) => setAddProject(e.target.checked)}
            />
            Add a project now
          </label>
        </div>

        {/* Collapsible Project Fields */}
        <div
          className={`project-fields-wrapper ${
            addProject ? "expanded" : "collapsed"
          }`}
        >
          {addProject && (
            <div className="project-fields">
              <h3 className="project-title">Project Details</h3>

              <label htmlFor="projectTitle">
                Project Title <span className="required">*</span>
              </label>
              <input
                id="projectTitle"
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="Enter project title"
                className="input-field"
              />

              <label htmlFor="projectDescription">
                Project Description <span className="required">*</span>
              </label>
              <textarea
                id="projectDescription"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Tell us about your project"
                className="textarea-field"
              />

              <label htmlFor="techStack">Tech Stack</label>
              <input
                id="techStack"
                type="text"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                placeholder="e.g. React, Node.js, MongoDB"
                className="input-field"
              />

              <label htmlFor="githubRepo">GitHub Repository</label>
              <input
                id="githubRepo"
                type="url"
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
                placeholder="Enter GitHub repo URL"
                className="input-field"
              />

              <label htmlFor="liveDemo">Live Demo (optional)</label>
              <input
                id="liveDemo"
                type="url"
                value={liveDemo}
                onChange={(e) => setLiveDemo(e.target.value)}
                placeholder="Enter live demo URL"
                className="input-field"
              />
            </div>
          )}
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="create-team-btn" disabled={loading}>
          {loading ? "Creating..." : "Create Team"}
        </button>
      </form>
    </div>
  );
}

export default CreateTeam;
