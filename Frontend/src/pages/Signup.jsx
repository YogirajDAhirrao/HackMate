import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import { signup } from "../api/user";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    github: "",
    skills: "",
    interests: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error before submission

    // Prepare data: convert skills & interests to arrays, filter out empty values
    const payload = {
      ...formData,
      skills: formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== ""),
      interests: formData.interests
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i !== ""),
    };

    try {
      const user = await signup(payload);
      console.log("Signed up as:", user);
      setUser(user);
      navigate("/");
    } catch (error) {
      setError(error.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="signup-page">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <textarea
          name="bio"
          placeholder="Short Bio"
          value={formData.bio}
          onChange={handleChange}
        />
        <input
          name="github"
          placeholder="GitHub URL"
          value={formData.github}
          onChange={handleChange}
        />
        <input
          name="skills"
          placeholder="Skills (comma-separated)"
          value={formData.skills}
          onChange={handleChange}
        />
        <input
          name="interests"
          placeholder="Interests (comma-separated)"
          value={formData.interests}
          onChange={handleChange}
        />
        <button type="submit">Sign Up</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
