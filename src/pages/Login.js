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
    <div className="w-screen h-screen bg-gray-100 flex justify-center ">
      <div className="flex flex-col justify-center h-full max-w-md w-full m-auto">
        <div className="flex flex-col items-center bg-white p-4  rounded">
          <p className="mb-4 text-xs text-red-500">{error && error}</p>
          <input
            className="text-sm text-black w-full m-2 p-5 h-2 border border-gray-300 rounded "
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="text-sm text-black w-full m-2 p-5 h-2 border border-gray-300 rounded "
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="bg-blue-500 text-white w-full rounded h-8 font-bold"
            onClick={handleSubmit}
            disabled={loading}
          >
            Login
          </button>
        </div>
        <div className="text-center w-full bg-white p-4 rounded mt-4">
          <p className="text-sm">
            Don't have an account{" "}
            <Link className="font-bold text-blue-500" to="/signup">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
