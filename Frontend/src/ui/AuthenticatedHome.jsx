
import Card from "./Card";
import HackathonList from "./HackathonList";
import RequestsPreview from "./RequestsPreview";
import "./AuthenticatedHome.css";
import CreateTeamCTA from "./CreateTeamCTA";
import TeamInfo from "./TeamInfo";
import { Link } from "react-router-dom";

function AuthenticatedHome({ user }) {
  
  return (
    <div className="homepage-container">
      <h1 className="welcome">Welcome, {user.name}</h1>
      <div className="grid">
        <Card title="Your Team">
          {user.team ? <TeamInfo /> : <CreateTeamCTA />}
        </Card>
        <Card title="Find Teammates">
          <Link to="/explore">Search</Link>
        </Card>
        <Card title="Your Requests">
          <RequestsPreview />
        </Card>
        <Card title="Upcoming Hackathons">
          <HackathonList />
        </Card>
      </div>
    </div>
  );
}

export default AuthenticatedHome;
