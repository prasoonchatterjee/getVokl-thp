import React, { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const history = useHistory();
  async function handleSubmit() {
    try {
      setError("");
      setLoading(true);
      await login(email, password);
      history.push("/");
    } catch (e) {
      setLoading(false);
      setError(e.message);
    }
  }
  return (
    <div>
      <p>{error && error}</p>
      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit} disabled={loading}>
        Login
      </button>
      <div>
        Don't have an account <Link to="/signup">Sign up</Link>
      </div>
    </div>
  );
}
