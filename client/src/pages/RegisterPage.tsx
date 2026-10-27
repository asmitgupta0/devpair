import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";

type RegisterPageProps = {
  setUser: React.Dispatch<
    React.SetStateAction<{ username: string; email: string } | null>
  >;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function RegisterPage({
  setUser,
  setAuthenticated,
}: RegisterPageProps) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleUserRegistration(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      console.log("response:", response);
      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        setError("Registration failed. Check your details and try again.");
        setPassword("");
        return;
      }
      navigate("/login");
    } catch (error) {
      setError("Server down or network problem.");
    }
  }

  return (
    <>
      <h1>Register</h1>
      <form onSubmit={handleUserRegistration}>
        <label>
          Enter username
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </label>
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
        <button type="submit">Register</button>
      </form>
      <p style={{ color: "red" }}>{error}</p>
      <p>
        Already have an account?
        <Link to="/login">Login</Link>
      </p>
    </>
  );
}
