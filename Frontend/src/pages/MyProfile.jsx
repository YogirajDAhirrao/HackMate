import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { updateProfile } from "../api/user";
import "./Profile.css";

function MyProfile() {
  const { user, setUser, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    github: "",
    skills: "",
    interests: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        github: user.github || "",
        skills: user.skills?.join(", ") || "",
        interests: user.interests?.join(", ") || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      skills: formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
      interests: formData.interests
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i),
    };
    try {
      const updatedUser = await updateProfile(payload);
      setUser((prev) => ({ ...prev, ...updatedUser.user }));
      setIsEditing(false);
      setError(null);
    } catch (error) {
      console.error(error);
      setError(error.message || "Failed to update profile");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-image">
          <img src={user?.avatar || "/images/image.png"} alt="Profile" />
        </div>
        <h2>{user.name}</h2>
        <p className="profile-email">{user.email}</p>
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
        </div>
        <div className="form-group">
          <label>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div className="form-group">
          <label>GitHub URL</label>
          <input
            name="github"
            value={formData.github}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div className="form-group">
          <label>Skills (comma-separated)</label>
          <input
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div className="form-group">
          <label>Interests (comma-separated)</label>
          <input
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        {isEditing ? (
          <>
            <button type="submit">Save Changes</button>
            <button type="button" onClick={handleEditToggle}>
              Cancel
            </button>
          </>
        ) : (
          <button type="button" onClick={handleEditToggle}>
            Edit Profile
          </button>
        )}
        {error && <p className="error-message">{error}</p>}
      </form>

      {/* TEAMS */}
      <div className="profile-section">
        <h3>Teams</h3>
        {user.teams && user.teams.length > 0 ? (
          <ul className="list">
            {user.teams.map((team) => (
              <li key={team._id}>
                <Link to={`/team/${team.slug}`}>{team.name}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No team joined yet.</p>
        )}
      </div>

      {/* FRIENDS */}
      <div className="profile-section">
        <h3>Friends</h3>
        {user.friends && user.friends.length > 0 ? (
          <ul className="list">
            {user.friends.map((friend) => (
              <li key={friend._id}>
                <Link to={`/profile/${friend.slug}`}>{friend.name}</Link> -{" "}
                {friend.email}
              </li>
            ))}
          </ul>
        ) : (
          <p>No friends added yet.</p>
        )}
      </div>
    </div>
  );
}

export default MyProfile;
