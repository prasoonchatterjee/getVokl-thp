import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { firebase, FieldValue } from "./lib/firebase";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Profile from "./pages/Profile";
import FirebaseContext from "./context/FirebaseContext";
import AuthContext from "./context/AuthContext";
import ProtectedRoutes from "./helpers/ProtectedRoutes";

function App() {
  return (
    <FirebaseContext.Provider value={{ firebase, FieldValue }}>
      <AuthContext>
        <BrowserRouter>
          <Switch>
            <ProtectedRoutes exact path="/" component={Homepage} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <ProtectedRoutes exact path="/profile" component={Profile} />
          </Switch>
        </BrowserRouter>
      </AuthContext>
    </FirebaseContext.Provider>
  );
}

export default App;
