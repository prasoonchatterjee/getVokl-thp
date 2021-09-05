import React, { useState } from "react";
import ChannelContainer from "../components/ChannelContainer";
import MessageContainer from "../components/MessageContainer";
import MetaContainer from "../components/MetaContainer";
import ChannelContext from "../context/ChannelContext";

export default function Homepage() {
  const [channelSelected, setChannelSelected] = useState(null);
  const value = { channelSelected, setChannelSelected };
  return (
    <div className="bg-gray-100 h-screen w-screen flex justify-between">
      <ChannelContext.Provider value={value}>
        <ChannelContainer />
        <MessageContainer />
        <MetaContainer />
      </ChannelContext.Provider>
    </div>
  );
}
