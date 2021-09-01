import React, { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const { signup } = useAuth();
  async function handleSubmit() {
    try {
      setError("");
      setLoading(true);
      await signup(name, email, password);
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
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
        Sign up
      </button>
      <div>
        Already have an account ? <Link to="login">Login</Link>{" "}
      </div>
    </div>
  );
}
