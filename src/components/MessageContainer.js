import React, { useState, useContext, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import ChannelContext from "../context/ChannelContext";
import FirebaseContext from "../context/FirebaseContext";

export default function MessageContainer() {
  const [message, setMessage] = useState("");
  const [channelMessages, setChannelMessages] = useState([]);
  const { channelSelected } = useContext(ChannelContext);
  const { firebase, FieldValue } = useContext(FirebaseContext);
  const { authenticatedUser } = useAuth();

  function handleClick() {
    firebase
      .firestore()
      .collection("messages")
      .add({
        channelId: channelSelected,
        text: message,
        createdAt: FieldValue.serverTimestamp(),
        createdBy: {
          displayName: authenticatedUser.displayName,
          uid: authenticatedUser.uid,
        },
      })
      .then((response) => {
        setMessage("");
      });
  }

  useEffect(() => {
    if (channelSelected) {
      const unsubscribe = firebase
        .firestore()
        .collection("messages")
        .orderBy("createdAt")
        .limit(50)
        .onSnapshot((snapshot) => {
          const changes = snapshot.docChanges();
          const filteredChanges = changes.filter(
            (item) => item.type === "added"
          );
          const newChanges = filteredChanges.map((item) => ({
            ...item.doc.data(),
            docId: item.doc.id,
          }));

          const finalChanges = newChanges.filter((item) => {
            return item.channelId === channelSelected;
          });
          setChannelMessages((prevState) => {
            if (prevState[0] && prevState[0].channelId === channelSelected) {
              return [...prevState, ...finalChanges];
            } else {
              return [...finalChanges];
            }
          });
        });
      return unsubscribe;
    }
  }, [channelSelected]);

  function styleMessage(message) {
    if (message.createdBy.uid === authenticatedUser.uid) {
      return `bg-blue-200 self-end`;
    } else return `bg-red-200 self-start`;
  }
  return (
    <div className="w-1/2  flex flex-col justify-end">
      <div className="flex flex-col overflow-auto">
        {channelMessages.length > 0 &&
          channelMessages.map((message) => (
            <p
              key={message.docId}
              className={`mt-2 p-1 px-3 mx-3  rounded ${styleMessage(message)}`}
            >
              {message.text}
            </p>
          ))}
      </div>
      <div className=" flex justify-between h-14 mt-3">
        <input
          placeholder="write your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-auto p-2 h-full"
        />
        <button
          onClick={handleClick}
          className="bg-green-500 rounded text-white font-bold w-28 h-full"
        >
          Send
        </button>
      </div>
    </div>
  );
}
