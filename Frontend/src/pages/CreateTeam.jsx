import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTeam } from "../api/team";
import "./CreateTeam.css";

function CreateTeam() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createTeam({ name, description });
      navigate("/team"); // or navigate(`/team/${result.teamId}`) if needed
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

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="create-team-btn" disabled={loading}>
          {loading ? "Creating..." : "Create Team"}
        </button>
      </form>
    </div>
  );
}

export default CreateTeam;
