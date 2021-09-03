import React, { useState, useContext, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import ChannelContext from "../context/ChannelContext";
import FirebaseContext from "../context/FirebaseContext";

export default function ChannelContainer() {
  const [channelName, setChannelName] = useState("");
  const [channelDetails, setChannelDetails] = useState("");
  const [channels, setChannels] = useState([]);

  const { authenticatedUser } = useAuth();
  const { firebase, FieldValue } = useContext(FirebaseContext);
  const { setChannelSelected } = useContext(ChannelContext);

  //create new channel
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
        createdAt: FieldValue.serverTimestamp(),
        accessMembers: [authenticatedUser.uid],
      })
      .then((response) => {
        setChannelName("");
        setChannelDetails("");
      })
      .catch((err) => {
        console.log(err);
      });
  }

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
          console.log(`newChanges`, newChanges);
          setChannelSelected(newChanges[0].docId);
        }
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

      {channels.length > 0 &&
        channels.map((channel) => (
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
