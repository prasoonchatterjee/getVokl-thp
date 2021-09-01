import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Homepage() {
  const { logout } = useAuth();
  return (
    <div>
      <button onClick={logout}>Log out</button>
    </div>
  );
}
