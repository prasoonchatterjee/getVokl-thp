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

  const isInvalid = name === "" || email === "" || password === "";

  return (
    <div className="w-screen h-screen bg-gray-100 flex justify-center ">
      <div className="flex flex-col justify-center h-full max-w-md w-full m-auto">
        <div className="flex flex-col items-center bg-white p-4  rounded">
          <p className="mb-4 text-xs text-red-500">{error && error}</p>

          <input
            className="text-sm text-black w-full m-2 p-5 h-2 border border-gray-300 rounded"
            placeholder="Enter your username"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="text-sm text-black w-full m-2 p-5 h-2 border border-gray-300 rounded"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="text-sm text-black w-full m-2 p-5 h-2 border border-gray-300 rounded"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            disabled={loading || isInvalid}
            className={`bg-blue-500 text-white w-full rounded h-8 font-bold ${
              isInvalid && "opacity-50"
            }`}
          >
            Sign up
          </button>
        </div>
        <div className="text-center w-full bg-white p-4 rounded mt-4">
          <p className="text-sm">
            Already have an account ?{" "}
            <Link className="font-bold text-blue-500" to="login">
              Login
            </Link>{" "}
          </p>
        </div>
      </div>
    </div>
  );
}
