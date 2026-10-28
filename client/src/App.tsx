import { Route, Routes } from "react-router";
import { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import RoomPage from "./pages/RoomPage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  const [user, setUser] = useState<{
    username: string;
    email: string;
  } | null>(null);

  console.log("auth state:", { authenticated, user });

  useEffect(() => {
    async function checkAuth() {
      const response = await fetch("http://localhost:5000/auth/me", {
        credentials: "include",
      });

      if (!response.ok) {
        setAuthenticated(false);
        setUser(null);
        return;
      }

      const data = await response.json();

      setAuthenticated(data.authenticated);
      setUser({
        username: data.username,
        email: data.email,
      });
    }

    checkAuth();
  }, []);

  const handleLogout = async () => {
    await fetch("http://localhost:5000/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setAuthenticated(false);
    setUser(null);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage handleLogout={handleLogout} authenticated={authenticated} />
        }
      />
      <Route path="room/:roomId" element={<RoomPage />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route
        path="/login"
        element={
          <LoginPage setUser={setUser} setAuthenticated={setAuthenticated} />
        }
      ></Route>
      <Route
        path="/register"
        element={
          <RegisterPage setUser={setUser} setAuthenticated={setAuthenticated} />
        }
      ></Route>
    </Routes>
  );
}

export default App;
