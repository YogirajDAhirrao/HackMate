import Card from "./Card";
import RequestsPreview from "./RequestsPreview";
import "./AuthenticatedHome.css";

import { Link } from "react-router-dom";

function AuthenticatedHome({ user }) {
  if (!user) return <div>Loading...</div>;
  return (
    <div className="homepage-container">
      <h1 className="welcome">Welcome, {user?.name}</h1>
      <div className="grid">
        <Card title="Your Team">
          {user?.teams?.length > 0 ? (
            <Link to="/my-team">View Your Teams</Link>
          ) : (
            <>You have not joined any team</>
          )}
        </Card>
        <Card title="Find Teammates">
          <Link to="/explore">Search</Link>
        </Card>
        <Card title="Your Requests">
          <RequestsPreview />
        </Card>
        <Card title="Chat With Your Hackmates!!">
          <Link to="/my-groups">View Chats</Link>
        </Card>
      </div>
    </div>
  );
}

export default AuthenticatedHome;
