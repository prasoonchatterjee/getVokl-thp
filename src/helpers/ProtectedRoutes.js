import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoutes({ component: Component, ...rest }) {
  const { authenticatedUser } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) => {
        return authenticatedUser ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        );
      }}
    />
  );
}
