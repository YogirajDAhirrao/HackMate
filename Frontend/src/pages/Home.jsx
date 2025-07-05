import { useAuth } from "../context/AuthContext";
import AuthenticatedHome from "../ui/AuthenticatedHome";
import UnauthenticatedHome from "../ui/UnauthenticatedHome";
//import "./Home.css";

function Home() {
  const { user, loading } = useAuth();
  if (loading) return <div>LOADING...</div>;
  return (
    <>{user ? <AuthenticatedHome user={user} /> : <UnauthenticatedHome />}</>
  );
}

export default Home;
