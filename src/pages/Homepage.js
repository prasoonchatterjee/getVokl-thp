import React, { useState } from "react";
import ChannelContainer from "../components/ChannelContainer";
import MessageContainer from "../components/MessageContainer";
import MetaContainer from "../components/MetaContainer";
import { useAuth } from "../context/AuthContext";
import ChannelContext from "../context/ChannelContext";

export default function Homepage() {
  const [channelSelected, setChannelSelected] = useState(null);
  const { logout } = useAuth();
  const value = { channelSelected, setChannelSelected };
  return (
    <div>
      <ChannelContext.Provider value={value}>
        <button onClick={logout}>Log out</button>
        <ChannelContainer />
        <MessageContainer />
        <MetaContainer />
      </ChannelContext.Provider>
    </div>
  );
}
