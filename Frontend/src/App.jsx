// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import AppLayout from "./ui/AppLayout";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Explore from "./pages/Explore";
import MyProfile from "./pages/MyProfile";
import UserProfile from "./pages/UserProfile";
import SearchContextWrapper from "./context/SearchContextWrapper";
import Requests from "./pages/Requests";
import TeamInfo from "./pages/TeamInfo";
import CreateTeam from "./pages/CreateTeam";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/create-team" element={<CreateTeam />} />

          <Route element={<SearchContextWrapper />}>
            <Route path="/explore" element={<Explore />} />
            <Route path="/profile/:slug" element={<UserProfile />} />
          </Route>
          <Route path="/my-team" element={<TeamInfo />} />
          <Route path="/requests" element={<Requests />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
