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
  return (
    <div>
      <p>MessageContainer</p>
      <input
        placeholder="write your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleClick}>Send</button>
      {channelMessages.length > 0 &&
        channelMessages.map((message) => (
          <p key={message.docId}>{message.text}</p>
        ))}
    </div>
  );
}
