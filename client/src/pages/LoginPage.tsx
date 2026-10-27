import { useState } from "react";
import { Link, useNavigate } from "react-router";

type LoginPageProps = {
  setUser: React.Dispatch<
    React.SetStateAction<{ username: string; email: string } | null>
  >;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function LoginPage({
  setUser,
  setAuthenticated,
}: LoginPageProps) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleUserLogin(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    console.log("response:", response);
    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status}`);
      setError("Invalid email or password");
      setPassword("");
      return;
    }
    const user = await response.json();
    if (!user || !user.authenticated) {
      console.error(`HTTP error! Status: ${response.status}`);
      setError("Invalid email or password");
      setPassword("");
      return;
    }
    console.log("user", user);

    setUser({
      username: user.username,
      email: email,
    });

    setAuthenticated(true);
    navigate("/");
  }
  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleUserLogin}>
        <label>
          Enter email
          <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </label>
        <label>
          Enter your password
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </label>
        <button type="submit">Login</button>
      </form>
      <p style={{ color: "red" }}>{error}</p>
      <p>
        Don't have an account?
        <Link to="/register">Register</Link>
      </p>
    </>
  );
}
