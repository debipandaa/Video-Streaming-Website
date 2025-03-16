import Home from "./pages/Home/Home";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login.jsx";
import VideoPlayer from "./components/VideoPlayer/VideoPlayer.jsx";
import { useNavigate } from "react-router-dom";
import Try from "./pages/Home/Try.jsx";

const App = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/stream"
          element={<VideoPlayer onBack={() => navigate("/")} />}
        />
      </Routes>
    </div>
  );
};

export default App;
