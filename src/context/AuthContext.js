import React, { useContext, useState, useEffect } from "react";
import FirebaseContext from "./FirebaseContext";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [authenticatedUser, setAuthenticatedUser] = useState();
  const [firestoreUser, setFirestoreUser] = useState();
  const [loading, setLoading] = useState(true);

  const { firebase, FieldValue } = useContext(FirebaseContext);
  function login(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return firebase.auth().signOut();
  }

  function addUserToFirestore(id, name, email) {
    return firebase.firestore().collection("users").doc(id).set({
      displayName: name,
      email: email,
      createdAt: FieldValue.serverTimestamp(),
    });
  }

  async function signup(name, email, password) {
    const response = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    await firebase.auth().currentUser.updateProfile({ displayName: name });
    await addUserToFirestore(response.user.uid, name, email);
  }

  async function updateAuthenticatedUser(name, email) {
    await firebase.auth().currentUser.updateProfile({ displayName: name });
    await firebase.auth().currentUser.updateEmail(email);
    return firebase.auth().currentUser;
  }

  async function updateFirestoreUser(id, name, email) {
    const response = await firebase
      .firestore()
      .collection("users")
      .doc(id)
      .set({ displayName: name, email: email });
  }

  async function updateUser(name, email) {
    const updatedAuthUser = await updateAuthenticatedUser(name, email);
    const id = updatedAuthUser.uid;
    await updateFirestoreUser(id, name, email);
    getUserFromFirestore();
  }

  function getUserFromFirestore() {
    firebase
      .firestore()
      .collection("users")
      .doc(authenticatedUser.uid)
      .get()
      .then((doc) => {
        setFirestoreUser({ ...doc.data(), docId: doc.id });
      });
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
