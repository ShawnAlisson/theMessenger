import React, { useContext } from "react";

import { Box, useColorModeValue } from "@chakra-ui/react";

import ChatContext from "../../Context/chatContext";
import SingleChat from "./SingleChat";

const ChatBox = ({ getAgain, setGetAgain }) => {
  //* Context
  const { selectedChat } = useContext(ChatContext);

  const bg = useColorModeValue("white", "gray.800");

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      padding={3}
      bg={bg}
      width={{ base: "100%", md: "100%" }}
      height={"88vh"}
      borderRadius={{ base: "0px 0px 25px 25px", md: "25px 25px 25px 25px" }}
    >
      <SingleChat getAgain={getAgain} setGetAgain={setGetAgain} />
    </Box>
  );
};

export default ChatBox;
