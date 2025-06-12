// ui/ProfileCard.jsx
import { useNavigate } from "react-router-dom";
import "./ProfileCard.css";

const ProfileCard = ({ user }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if(!user.slug){
      alert("This user's profile is being updated");
      return;
    }
    navigate(`/profile/${user.slug}`); // Navigate to the user's profile page
  };

  return (
    <div className="profile-card" onClick={handleClick}>
      <h3>{user.name}</h3>
      <p className="bio">{user.bio || "No bio available"}</p>
      {user.github && (
        <p>
          <a
            href={user.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()} // Prevent navigation when clicking the link
          >
            GitHub Profile
          </a>
        </p>
      )}
      <p>
        <strong>Skills:</strong>{" "}
        {user.skills?.length > 0 ? user.skills.join(", ") : "None"}
      </p>
      <p>
        <strong>Interests:</strong>{" "}
        {user.interests?.length > 0 ? user.interests.join(", ") : "None"}
      </p>
    </div>
  );
};

export default ProfileCard;
