import React, { useState, useContext, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import ChannelContext from "../context/ChannelContext";
import FirebaseContext from "../context/FirebaseContext";

export default function MessageContainer() {
  const [message, setMessage] = useState("");
  const [channelMessages, setChannelMessages] = useState([]);
  const { channelSelected } = useContext(ChannelContext);
  const { firebase, FieldValue } = useContext(FirebaseContext);
  const { authenticatedUser } = useAuth();
  const dummy = useRef();

  function handleClick(e) {
    e.preventDefault();
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
        dummy.current.scrollIntoView({ behavior: "smooth" });
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

  const isInvalid = message === "";

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
        <div ref={dummy}></div>
      </div>
      <form
        className=" flex justify-between h-14 mt-3 mx-3"
        onSubmit={handleClick}
      >
        <input
          placeholder="write your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-auto p-2 h-full"
          required
        />
        <button
          // onClick={handleClick}
          className={`bg-green-500 rounded text-white font-bold w-28 h-full ${
            isInvalid && "opacity-50"
          } `}
          disabled={isInvalid}
        >
          Send
        </button>
      </form>
    </div>
  );
}
