import React, { useState, useEffect, useContext } from "react";
import ChannelContext from "../context/ChannelContext";
import FirebaseContext from "../context/FirebaseContext";
import { useAuth } from "../context/AuthContext";

export default function MetaContainer() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const { firebase, FieldValue } = useContext(FirebaseContext);
  const { channelSelected } = useContext(ChannelContext);
  const { authenticatedUser } = useAuth();
  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .get()
      .then((response) => {
        const finalUsers = response.docs.map((item) => ({
          ...item.data(),
          docId: item.id,
        }));
        setUsers(finalUsers);
        setSelectedUser(authenticatedUser.uid);
      });
  }, []);

  function handleClick() {
    firebase
      .firestore()
      .collection("channels")
      .doc(channelSelected)
      .update({
        accessMembers: FieldValue.arrayUnion(selectedUser),
      });
  }
  return (
    <div>
      <p>MetaContainer</p>
      <select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        {users.length &&
          users.map((user) => (
            <option key={user.docId} value={user.docId}>
              {user.displayName}
            </option>
          ))}
      </select>
      <button onClick={handleClick}>Add user to channel</button>
    </div>
  );
}
