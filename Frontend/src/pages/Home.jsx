import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthenticatedHome from "../ui/AuthenticatedHome";
import UnauthenticatedHome from "../ui/UnauthenticatedHome";
import "./Home.css";

function Home() {
  const { user, loading } = useAuth();
  const [showBackendMessage, setShowBackendMessage] = useState(false);
  const [extraMessage, setExtraMessage] = useState(false);

  useEffect(() => {
    let timer;
    let nextTimer;
    if (loading) {
      // after 3 seconds, show "Spinning up backend…" instead of just loading
      timer = setTimeout(() => {
        setShowBackendMessage(true);
      }, 3000);
      nextTimer = setTimeout(() => {
        setExtraMessage(true);
      }, 9000);
    } else {
      setShowBackendMessage(false); // reset when not loading
    }
    return () => {
      clearTimeout(timer);
      clearTimeout(nextTimer);
    };
  }, [loading]);

  if (loading)
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p className="loading-text">
          {showBackendMessage ? "Spinning up the backend…" : "Loading…"}
          {extraMessage ? "Almost there !!" : " "}
        </p>
      </div>
    );

  return (
    <>{user ? <AuthenticatedHome user={user} /> : <UnauthenticatedHome />}</>
  );
}

export default Home;
