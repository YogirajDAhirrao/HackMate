import { Link } from "react-router-dom";

function UnauthenticatedHome() {
  return (
    <section className="home">
      <div className="home-container">
        <h1 className="home-title">Find Your Perfect Hackathon Team</h1>
        <p className="home-subtitle">
          Connect with like-minded developers and build amazing projects
          together.
        </p>
        <Link to="/signup" className="home-cta">
          Get Started
        </Link>
      </div>
    </section>
  );
}

export default UnauthenticatedHome
