import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const ProfileSection = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null); // For handling delay

  const handleMouseEnter = () => {
    // Clear any existing timeout to prevent closing
    if (timeoutId) clearTimeout(timeoutId);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    // Set a timeout to close the dropdown after a short delay
    const id = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200); // 200ms delay
    setTimeoutId(id);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className="profile-section"
      style={{ position: "relative" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Profile Avatar and Name */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          color: "#fff",
        }}
      >
        <img
          src={user?.avatar || "/images/image.png"} // Fallback avatar
          alt="Profile"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            marginRight: "10px",
          }}
        />
        <span>{user?.name || "User"}</span>
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div
          style={{
            position: "absolute",
            top: "45px", // Reduced gap to make transition smoother
            right: "0",
            backgroundColor: "#2a2a3c",
            borderRadius: "5px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            zIndex: 10,
          }}
        >
          <ul style={{ listStyle: "none", padding: "10px", margin: "0" }}>
            <li>
              <Link
                to="/myprofile"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  display: "block",
                  padding: "5px 10px",
                }}
              >
                {/* <a
                href="/profile"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  display: "block",
                  padding: "5px 10px",
                }}
              > */}
                View Profile
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                style={{
                  background: "none",
                  border: "none",
                  color: "#fff",
                  padding: "5px 10px",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
