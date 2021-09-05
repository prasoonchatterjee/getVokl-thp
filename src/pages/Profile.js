import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState("");
  const { updateUser, firestoreUser } = useAuth();
  const [message, setMessage] = useState("");

  const history = useHistory();
  useEffect(() => {
    if (firestoreUser) {
      setEmail(firestoreUser.email);
      setName(firestoreUser.displayName);
    }
  }, [firestoreUser]);

  async function handleSubmit() {
    try {
      setMessage("");
      setLoading(true);
      await updateUser(name, email);
      setMessage("profile updated successfully");
      setLoading(false);
    } catch (e) {
      setLoading(false);
      setMessage(e.message);
    }
  }

  return (
    <div className="w-screen h-screen bg-gray-100 flex justify-center">
      <div className="flex flex-col justify-center h-full max-w-md w-full m-auto">
        <div className="flex flex-col items-center bg-white p-4  rounded">
          <p className="mb-4 text-xs text-red-900">{message && message}</p>
          <input
            className="text-sm text-black w-full m-2 p-5 h-2 border border-gray-300 rounded "
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="text-sm text-black w-full m-2 p-5 h-2 border border-gray-300 rounded "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white w-full rounded h-8 font-bold"
            onClick={handleSubmit}
            disabled={loading}
          >
            Update profile
          </button>
        </div>
        <div className="text-center w-full bg-white p-4 rounded mt-4">
          <p className="text-sm">
            Go back to{" "}
            <Link className="font-bold text-blue-500" to="/">
              Homepage
            </Link>
            {`  or   `}
            <Link className="font-bold text-blue-500" to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
