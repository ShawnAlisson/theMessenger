import React, { useState, useContext } from "react";

import { Box } from "@chakra-ui/react";

import ChatContext from "../Context/chatContext";
import SideBar from "../components/others/SideBar";
import MyChats from "../components/chats/MyChats";
import ChatBox from "../components/chats/ChatBox";

const Chats = () => {
  const [getAgain, setGetAgain] = useState(false);

  //* Context
  const { user } = useContext(ChatContext);

  return (
    <div style={{ width: "100%" }}>
      <Box
        display={"flex"}
        flexDir={{ base: "column", md: "row" }}
        padding="12px"
        justifyContent="space-between"
      >
        <Box width={{ base: "100%", md: "31%" }} bg={"white"} borderRadius="25">
          {user && <SideBar />}
          {user && <MyChats getAgain={getAgain} />}
        </Box>
        <Box width={{ base: "100%", md: "68%" }}>
          {user && <ChatBox getAgain={getAgain} setGetAgain={setGetAgain} />}
        </Box>
      </Box>
    </div>
  );
};

export default Chats;
