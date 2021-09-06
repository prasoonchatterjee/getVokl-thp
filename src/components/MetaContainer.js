import React, { useState, useEffect, useContext } from "react";
import ChannelContext from "../context/ChannelContext";
import FirebaseContext from "../context/FirebaseContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function MetaContainer() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [channelName, setChannelName] = useState("");
  const [channelDetails, setChannelDetails] = useState("");
  const [error, setError] = useState("");

  const { firebase, FieldValue } = useContext(FirebaseContext);
  const { channelSelected } = useContext(ChannelContext);
  const { authenticatedUser, logout, firestoreUser } = useAuth();

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .onSnapshot((snapshot) => {
        const changes = snapshot.docChanges();
        const filteredChanges = changes.filter((item) => item.type === "added");
        const newChanges = filteredChanges.map((item) => ({
          ...item.doc.data(),
          docId: item.doc.id,
        }));
        setUsers((prevState) => {
          if (prevState.length) {
            return [...prevState, ...newChanges];
          } else {
            return [...newChanges];
          }
        });
      });
  }, []);

  function handleUerAddition() {
    firebase
      .firestore()
      .collection("channels")
      .doc(channelSelected)
      .update({
        accessMembers: FieldValue.arrayUnion(selectedUser),
      });
  }

  //create new channel
  function handleChannelCreate() {
    firebase
      .firestore()
      .collection("channels")
      .add({
        name: channelName,
        details: channelDetails,
        createdBy: {
          displayName: authenticatedUser.displayName,
          id: authenticatedUser.uid,
        },
        createdAt: FieldValue.serverTimestamp(),
        accessMembers: [authenticatedUser.uid],
      })
      .then((response) => {
        setChannelName("");
        setChannelDetails("");
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  const isInvalid = channelName === "" || channelDetails === "";

  return (
    <div className="w-1/4  flex flex-col bg-purple-400 justify-between p-2">
      <div className="flex flex-col items-center  bg-gray-50 rounded mb-4">
        {firestoreUser && (
          <div className="p-2">
            <p className="p-1">username - {firestoreUser.displayName}</p>
            <p className="p-1">email - {firestoreUser.email}</p>
          </div>
        )}
        <div>
          <button className="bg-blue-500 text-white rounded font-bold h-8 w-32 m-2">
            <Link to="/profile">Update Profile</Link>
          </button>
          <button
            onClick={logout}
            className="bg-red-500 text-white rounded font-bold h-8 w-28 m-2"
          >
            Log out
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center bg-gray-50 rounded p-4">
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="w-full rounded p-2"
        >
          {users.length &&
            users.map((user) => (
              <option key={user.docId} value={user.docId}>
                {user.displayName}
              </option>
            ))}
        </select>
        <button
          onClick={handleUerAddition}
          className="bg-blue-500 rounded text-white w-full mt-2 h-8 font-bold"
        >
          Add user to channel
        </button>
      </div>
      <div className="flex flex-col items-center bg-gray-50 rounded p-4 mt-4">
        <p className="mb-4 text-xs text-red-500">{error && error}</p>
        <input
          className="text-sm text-black w-full m-2 p-5 h-2  rounded"
          placeholder="channel name"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
        />
        <input
          className="text-sm text-black w-full m-2 p-5 h-2 rounded"
          placeholder="channel details"
          value={channelDetails}
          onChange={(e) => setChannelDetails(e.target.value)}
        />
        <button
          onClick={handleChannelCreate}
          className={`bg-blue-500 text-white w-full rounded h-8 font-bold ${
            isInvalid && "opacity-50"
          }`}
          disabled={isInvalid}
        >
          Add channel
        </button>
      </div>
    </div>
  );
}
