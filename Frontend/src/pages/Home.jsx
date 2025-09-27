import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthenticatedHome from "../ui/AuthenticatedHome";
import UnauthenticatedHome from "../ui/UnauthenticatedHome";
import "./Home.css";

function Home() {
  const { user, loading } = useAuth();
  const [showBackendMessage, setShowBackendMessage] = useState(false);

  useEffect(() => {
    let timer;
    if (loading) {
      // after 3 seconds, show "Spinning up backend…" instead of just loading
      timer = setTimeout(() => {
        setShowBackendMessage(true);
      }, 3000);
    } else {
      setShowBackendMessage(false); // reset when not loading
    }
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading)
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p className="loading-text">
          {showBackendMessage ? "Spinning up the backend…" : "Loading…"}
        </p>
      </div>
    );

  return (
    <>{user ? <AuthenticatedHome user={user} /> : <UnauthenticatedHome />}</>
  );
}

export default Home;
