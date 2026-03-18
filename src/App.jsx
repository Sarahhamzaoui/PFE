import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Mission from "./pages/Missions";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import MissionDetails from "./pages/MissionDetails";  

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Missions" element={<Mission />} />
        <Route path="/Profile" element={<Profile />} /> 
        <Route path="/EditProfile" element={<EditProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;