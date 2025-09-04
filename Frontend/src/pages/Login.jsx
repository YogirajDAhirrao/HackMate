import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { getProfile, login } from "../api/user";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials);
      console.log("Logged in");
      const res = await getProfile();

      setUser(res.user);

      navigate("/"); // redirect to homepage
    } catch (err) {
      alert(err.message || "Login failed");
    }

    // try {
    //   // const res = await fetch("/api/auth/login", {
    //   //   method: "POST",
    //   //   headers: {
    //   //     "Content-Type": "application/json",
    //   //   },
    //   //   credentials: "include", // important for setting cookies
    //   //   body: JSON.stringify(credentials),
    //   // });
    //   const res = await login(credentials);
    //   console.log(res.ok);

    //   if (res.ok) {
    //     navigate("/");
    //   } else {
    //     const err = await res.json();
    //     alert(err.message || "Login failed");
    //   }
    // } catch (err) {
    //   console.error(err);
    //   alert("Something went wrong.");
    // }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          onChange={handleChange}
        />
        <button type="submit">Log In</button>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
