import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

import {
  Avatar,
  Box,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";

import ChatContext from "../../Context/chatContext";
import { getSender } from "../../config/ChatLogics";
import ChatLoading from "../others/ChatLoading";

const MyChats = ({ getAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const toast = useToast();
  const { t } = useTranslation();

  //* Context
  const { selectedChat, setSelectedChat, user, chats, setChats } =
    useContext(ChatContext);

  //* Date Handler
  function converToLocalTime(serverDate) {
    var dt = new Date(Date.parse(serverDate));
    var localDate = dt;

    var gmt = localDate;
    var min = gmt.getTime() / 1000 / 60; // convert gmt date to minutes
    var localNow = new Date().getTimezoneOffset(); // get the timezone
    // offset in minutes
    var localTime = min - localNow; // get the local time

    var dateStr = new Date(localTime * 1000 * 60);
    // dateStr = dateStr.toISOString("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"); // this will return as just the server date format i.e., yyyy-MM-dd'T'HH:mm:ss.SSS'Z'
    // dateStr = dateStr.toString()
    var year = dateStr.getFullYear();
    var month = ("0" + (dateStr.getMonth() + 1)).slice(-2);
    var day = ("0" + dateStr.getDate()).slice(-2);
    var hour = dateStr.getHours();
    var minute = ("0" + dateStr.getMinutes()).slice(-2);
    var second = ("0" + dateStr.getSeconds()).slice(-2);
    var dayWeek = dateStr.getDay();
    return [year, month, day, hour, minute, second, dayWeek];
  }

  var days = [
    t("sunday"),
    t("monday"),
    t("tuesday"),
    t("wednesday"),
    t("thursday"),
    t("friday"),
    t("saturday"),
  ];

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
                <Avatar
                  mr={2}
                  size="md"
                  cursor="pointer"
                  name={getSender(loggedUser, chat.users)}
                />

                <Box width="60%">
                  <Box display={"flex"}>
                    <Text
                      mr="2"
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
                  </Box>
                  <Box
                    color={latest_message_color}
                    fontSize={"14"}
                    noOfLines="1"
                  >
                    {chat?.latestMessage?.content}
                  </Box>
                </Box>
                <Box dir="rtl" display={"flex"} flexDir="column" width={"100%"}>
                  <Box dir="rtl" fontSize={"10"}>
                    {converToLocalTime(chat.updatedAt)[3]}:
                    {converToLocalTime(chat.updatedAt)[4]}
                  </Box>
                  <Box dir="rtl" fontSize={"10"}>
                    {days[converToLocalTime(chat.updatedAt)[6]]}
                  </Box>
                  <Box dir="rtl" fontSize={"10"}>
                    {converToLocalTime(chat.updatedAt)[0]}/
                    {converToLocalTime(chat.updatedAt)[1]}/
                    {converToLocalTime(chat.updatedAt)[2]}{" "}
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
