import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./ProfileDropdown.css"; // ✅ Import CSS module

const ProfileSection = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => setIsDropdownOpen(false), 200);
    setTimeoutId(id);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className="profile-dropdown"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="profile-trigger">
        <img
          src={user?.avatar || "/images/image.png"}
          alt="Avatar"
          className="profile-avatar"
        />
        <span className="profile-name">{user?.name || "User"}</span>
      </div>

      {isDropdownOpen && (
        <div className="dropdown-menu">
          <ul>
            <li>
              <Link to="/myprofile">View Profile</Link>
            </li>
            <li>
              <Link to="/create-team">Create Team</Link>
            </li>
            <li>
              <div onClick={handleLogout}>Logout</div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
