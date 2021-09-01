import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
export default function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState("");
  const { updateUser, firestoreUser } = useAuth();
  const [message, setMessage] = useState("");

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
    <div>
      <p>{message && message}</p>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleSubmit} disabled={loading}>
        Update profile
      </button>
    </div>
  );
}
