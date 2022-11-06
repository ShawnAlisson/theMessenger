import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Moment from "react-moment";
import "moment/locale/fa";

import {
  Avatar,
  Box,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import FiberManualRecordRoundedIcon from "@mui/icons-material/FiberManualRecordRounded";

import ChatContext from "../../Context/chatContext";
import { getSender } from "../../config/ChatLogics";
import ChatLoading from "../others/ChatLoading";

const MyChats = ({ getAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const toast = useToast();
  const { t, i18n } = useTranslation();

  //* Context
  const { selectedChat, setSelectedChat, user, chats, setChats } =
    useContext(ChatContext);

  //* Color Modes
  const bg = useColorModeValue("white", "gray.800");
  const bg_secondary = useColorModeValue("#F8F8F8", "gray.700");
  const latest_message_color = useColorModeValue("gray.600", "gray.400");

  //* Get Chats Handler
  const getChats = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        baseURL: process.env.REACT_APP_SERVER_URL,
      };

      const { data } = await axios.get("/chat/", config);
      setChats(data);
    } catch (error) {
      console.log(error.message);
      toast({
        title: "Oops!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    getChats();
  }, [getAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      padding={3}
      bg={bg}
      width={{ base: "100%", md: "100%" }}
      height="85vh"
      borderWidth="0px"
      borderRadius={{
        base: "0px 0px 25px 25px",
        md: "25px 25px 25px 25px",
      }}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        // fontFamily="Work sans"
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text>{t("my_chats")}</Text>
      </Box>
      <Box
        dir="ltr"
        display="flex"
        flexDir="column"
        padding={3}
        bg={bg_secondary}
        width="100%"
        height="100%"
        borderRadius="25"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat, i) => (
              // CHAT LIST BOX
              <Box
                display={"flex"}
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : ""}
                color={selectedChat === chat ? "white" : ""}
                px={3}
                py={2}
                borderRadius="25"
                key={chat._id}
              >
                {/* AVATAR */}

                <Box display={"flex"} mr="1">
                  <Avatar
                    display={"flex"}
                    flexDir="column"
                    size="md"
                    cursor="pointer"
                    name={getSender(loggedUser, chat.users)}
                  />
                </Box>

                <Box width="60%">
                  {/* CHAT NAME */}
                  <Box display={"flex"}>
                    <Text
                      mr="1"
                      display={"flex"}
                      flexDir={"column"}
                      maxWidth="70%"
                      noOfLines="1"
                    >
                      {!chat.isGroup
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}
                    </Text>
                    {chat.isGroup ? (
                      <GroupsRoundedIcon fontSize="medium" />
                    ) : (
                      <></>
                    )}
                    {/* NEW MESSAGE NOTIF */}
                    {chat?.latestMessage?.seen !== false ? (
                      ""
                    ) : (
                      <Box color={"#1982FC"}>
                        {chat?.latestMessage?.sender._id !== user._id ? (
                          <FiberManualRecordRoundedIcon />
                        ) : (
                          ""
                        )}
                      </Box>
                    )}
                  </Box>

                  {/* LATEST MESSAGE */}
                  <Box
                    color={latest_message_color}
                    fontSize={"14"}
                    noOfLines="1"
                  >
                    {chat?.latestMessage?.content}
                  </Box>
                </Box>

                {/* CHAT DATE */}
                <Box dir="rtl" display={"flex"} width={"100%"}>
                  <Box dir="rtl" fontSize={"10"}>
                    <Text dir={i18n.language === "en" ? "ltr" : "rtl"}>
                      <Moment
                        fromNow
                        locale={i18n.language === "en" ? "en" : "fa"}
                      >
                        {chat.updatedAt}
                      </Moment>
                    </Text>
                  </Box>
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
