import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import firebase from "./lib/firebase";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Profile from "./pages/Profile";
import FirebaseContext from "./context/FirebaseContext";
import AuthContext from "./context/AuthContext";
function App() {
  return (
    <div className="App">
      <FirebaseContext.Provider value={firebase}>
        <AuthContext>
          <BrowserRouter>
            <Switch>
              <Route exact path="/" component={Homepage} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/profile" component={Profile} />
            </Switch>
          </BrowserRouter>
        </AuthContext>
      </FirebaseContext.Provider>
    </div>
  );
}

export default App;
