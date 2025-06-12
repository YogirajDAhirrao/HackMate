import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";

function AppLayout() {
  return (
    <div className="app-layout">
      <NavBar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
