import React, { useState, useContext, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import ChannelContext from "../context/ChannelContext";
import FirebaseContext from "../context/FirebaseContext";

export default function ChannelContainer() {
  const [channelName, setChannelName] = useState("");
  const [channelDetails, setChannelDetails] = useState("");
  const [channels, setChannels] = useState([]);

  const { authenticatedUser } = useAuth();
  const firebase = useContext(FirebaseContext);
  const { setChannelSelected } = useContext(ChannelContext);

  useEffect(() => {
    if (channels.length > 0) {
      setChannelSelected(channels[0].docId);
    }
  }, [channels]);
  function handleSubmit() {
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
      });
  }

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("channels")
      .onSnapshot((snapshot) => {
        const changes = snapshot.docChanges();
        console.log(`snapshot`, snapshot);
        console.log(`changes`, changes);
        const channelsArray = changes.map((item) => ({
          ...item.doc.data(),
          docId: item.doc.id,
        }));
        setChannels(channelsArray);
      });

    return unsubscribe;
  }, []);

  return (
    <div>
      <p>ChannelContainer</p>
      <input
        placeholder="channel name"
        value={channelName}
        onChange={(e) => setChannelName(e.target.value)}
      />
      <input
        placeholder="about channel"
        value={channelDetails}
        onChange={(e) => setChannelDetails(e.target.value)}
      />
      <button onClick={handleSubmit}>Add channel</button>

      {channels.map((channel) => (
        <p
          key={channel.docId}
          onClick={() => setChannelSelected(channel.docId)}
        >
          {channel.name}
        </p>
      ))}
    </div>
  );
}
