import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import { signup } from "../api/user";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    github: "",
    skills: "",
    interests: "",
  });
  const { setUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data: convert skills & interests to arrays
    const payload = {
      ...formData,
      skills: formData.skills.split(",").map((s) => s.trim()),
      interests: formData.interests.split(",").map((i) => i.trim()),
    };

    try {
      const user = await signup(payload); // signup API returns user object
      console.log("Signed up as:", user);
      setUser(user);
      navigate("/"); // redirect
    } catch (error) {
      console.error(error);
      alert(error.message || "Signup failed");
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Prepare data: convert skills & interests to arrays
  //   const payload = {
  //     ...formData,
  //     skills: formData.skills.split(",").map((s) => s.trim()),
  //     interests: formData.interests.split(",").map((i) => i.trim()),
  //   };

  //   try {
  //     const user = await

  //   } catch (error) {

  //   }

  //   // try {
  //   //   // const res = await fetch("http://localhost:5000/auth/signup", {
  //   //   //   method: "POST",
  //   //   //   credentials: "include",
  //   //   //   headers: {
  //   //   //     "Content-Type": "application/json",
  //   //   //   },
  //   //   //   body: JSON.stringify(payload),
  //   //   // });
  //   //   const res = await signup(payload);

  //   //   if (res.ok) {
  //   //     navigate("/login");
  //   //   } else {
  //   //     const err = await res.json();
  //   //     alert(err.message || "Signup failed");
  //   //   }
  //   // } catch (err) {
  //   //   console.error(err);
  //   //   alert("Something went wrong.");
  //   // }
  // };

  return (
    <div className="signup-page">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
          required
        />
        <textarea name="bio" placeholder="Short Bio" onChange={handleChange} />
        <input name="github" placeholder="GitHub URL" onChange={handleChange} />
        <input
          name="skills"
          placeholder="Skills (comma-separated)"
          onChange={handleChange}
        />
        <input
          name="interests"
          placeholder="Interests (comma-separated)"
          onChange={handleChange}
        />

        <button type="submit">Sign Up</button>
        <p>
          Already have an account?<Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
