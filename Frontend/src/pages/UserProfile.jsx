import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getUserByID, sendFriendRequest } from "../api/user";
import "./UserProfile.css";

function UserProfile() {
  const { user: authUser, loading: authLoading } = useAuth();
  const { slug } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);
  const [sendingRequest, setSendingRequest] = useState(false);

  const handleRequestSent = async () => {
    if (!authUser || !user) return;

    setSendingRequest(true);
    setRequestStatus(null);

    try {
      const data = await sendFriendRequest(user._id);
      setRequestStatus(data.message);
    } catch (error) {
      setRequestStatus(error.message || "Failed to send friend request");
    } finally {
      setSendingRequest(false);
    }
  };

  // Redirect unauthenticated users
  useEffect(() => {
    if (!authLoading && !authUser) {
      navigate("/login");
    }
  }, [authUser, authLoading, navigate]);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      if (!slug || !authUser) return;

      try {
        setLoading(true);
        const userData = await getUserByID(slug);
        setUser(userData);
        console.log(userData);

        // If already friends
        if (userData.friends?.includes(authUser._id)) {
          setRequestStatus("Already friends");
        }
      } catch (error) {
        setError(error.message || "Failed to get user");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && authUser) {
      fetchUser();
    }
  }, [slug, authUser, authLoading]);

  if (authLoading || loading) {
    return <div>Loading...</div>;
  }

  const isOwnProfile = authUser && user && authUser._id === user._id;

  if (error) {
    return (
      <div className="user-profile-page">
        <h1>User Profile</h1>
        <p className="error-message">{error}</p>
        <button onClick={() => navigate("/explore")} className="back-button">
          Back to Explore
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-profile-page">
        <h1>User Profile</h1>
        <p>User not found.</p>
        <button onClick={() => navigate("/explore")} className="back-button">
          Back to Explore
        </button>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <h1>{user.name}'s Profile</h1>
      <div className="profile-details">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Bio:</strong> {user.bio || "No bio available"}
        </p>
        {user.github && (
          <p>
            <strong>GitHub:</strong>{" "}
            <a href={user.github} target="_blank" rel="noopener noreferrer">
              {user.github}
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

      {requestStatus && (
        <p
          className={
            requestStatus.includes("successfully") ||
            requestStatus === "Already friends"
              ? "success-message"
              : "error-message"
          }
        >
          {requestStatus}
        </p>
      )}

      <div className="button-group">
        <button onClick={() => navigate("/explore")} className="back-button">
          Back to Explore
        </button>
        {!isOwnProfile && (
          <button
            onClick={handleRequestSent}
            className="request-button"
            disabled={
              sendingRequest ||
              requestStatus === "Already friends" ||
              requestStatus === "Friend request already sent" ||
              requestStatus === "Friend request sent successfully"
            }
          >
            {sendingRequest
              ? "Sending..."
              : requestStatus === "Already friends" ||
                requestStatus === "Friend request already sent" ||
                requestStatus === "Friend request sent successfully"
              ? "Request Sent"
              : "Send Friend Request"}
          </button>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
