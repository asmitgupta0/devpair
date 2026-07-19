import HomePage from "./pages/HomePage";
import RoomPage from "./pages/RoomPage";
import NotFoundPage from "./pages/NotFoundPage";
import { Route, Routes } from "react-router";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="room/:roomId" element={<RoomPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
