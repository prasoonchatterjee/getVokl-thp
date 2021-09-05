import React, { useState, useContext, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import ChannelContext from "../context/ChannelContext";
import FirebaseContext from "../context/FirebaseContext";

export default function ChannelContainer() {
  const [channels, setChannels] = useState([]);

  const { authenticatedUser } = useAuth();
  const { firebase, FieldValue } = useContext(FirebaseContext);
  const { setChannelSelected, channelSelected } = useContext(ChannelContext);

  //pull all the channels and listen for additions and select one as well
  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("channels")
      .where("accessMembers", "array-contains", authenticatedUser.uid)
      .onSnapshot((snapshot) => {
        const changes = snapshot.docChanges();
        const filteredChanges = changes.filter((item) => item.type === "added");
        if (filteredChanges.length > 0) {
          const newChanges = filteredChanges.map((item) => ({
            ...item.doc.data(),
            docId: item.doc.id,
          }));
          setChannels((prevState) => {
            return [...prevState, ...newChanges];
          });
          setChannelSelected(newChanges[0].docId);
        }
      });

    return unsubscribe;
  }, []);

  function selectedChannel(docId) {
    if (docId === channelSelected) return "bg-purple-900";
    else return;
  }
  return (
    <div className="w-1/4 bg-indigo-600 overflow-auto">
      <p className="text-white font-extrabold text-center">Channels</p>
      {channels.length > 0 &&
        channels.map((channel) => (
          <p
            key={channel.docId}
            onClick={() => setChannelSelected(channel.docId)}
            className={`text-white p-2 m-2 rounded ${selectedChannel(
              channel.docId
            )}`}
          >
            # {channel.name}
          </p>
        ))}
    </div>
  );
}
