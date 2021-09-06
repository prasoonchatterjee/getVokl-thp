import React, { useContext, useState, useEffect } from "react";
import FirebaseContext from "./FirebaseContext";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [firestoreUser, setFirestoreUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { firebase, FieldValue } = useContext(FirebaseContext);

  function login(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  function logout() {
    setFirestoreUser(null);
    return firebase.auth().signOut();
  }

  async function updateFirestoreUser(id, name, email) {
    await firebase
      .firestore()
      .collection("users")
      .doc(id)
      .set({ displayName: name, email: email });
  }

  async function updateAuthenticatedUser(name, email) {
    await firebase.auth().currentUser.updateProfile({ displayName: name });
    await firebase.auth().currentUser.updateEmail(email);
    return firebase.auth().currentUser;
  }

  function getUserFromFirestore() {
    return firebase
      .firestore()
      .collection("users")
      .doc(authenticatedUser.uid)
      .get()
      .then((doc) => {
        setFirestoreUser({ ...doc.data(), docId: doc.id });
      });
  }

  function addUserToFirestore(id, name, email) {
    return firebase.firestore().collection("users").doc(id).set({
      displayName: name,
      email: email,
      createdAt: FieldValue.serverTimestamp(),
    });
  }

  async function signup(name, email, password) {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        console.log(`response`, response);
        addUserToFirestore(response.user.uid, name, email);
      })
      .then((response) => {
        firebase.auth().currentUser.updateProfile({ displayName: name });
      });
  }

  async function updateUser(name, email) {
    await updateAuthenticatedUser(name, email);
    await updateFirestoreUser(authenticatedUser.uid, name, email);
    getUserFromFirestore();
  }

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setAuthenticatedUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (authenticatedUser) {
      getUserFromFirestore();
    }
  }, [authenticatedUser]);

  const value = {
    authenticatedUser,
    firestoreUser,
    login,
    signup,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
