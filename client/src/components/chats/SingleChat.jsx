import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

import {
  Box,
  FormControl,
  IconButton,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import HashLoader from "react-spinners/HashLoader";
import Lottie from "react-lottie";

import ChatContext from "../../Context/chatContext";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import ProfileModal from "../others/ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import MessagesFeed from "./MessagesFeed";
import animationData from "../../animations/typing.json";

const ENDPOINT = process.env.REACT_APP_SOCKET_URI;
var socket, selectedChatCompare;

const SingleChat = ({ getAgain, setGetAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const toast = useToast();

  //* Lottie Animation Options
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    // rendererSettings: {
    //   preserveAspectRatio: "xMidYMid slice",
    // },
  };

  //* Context
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    useContext(ChatContext);

  //* Send Handler
  const sendHandler = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stoptyping", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          baseURL: process.env.REACT_APP_SERVER_URL,
        };

        setNewMessage("");

        const { data } = await axios.post(
          `/message`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        socket.emit("newmessage", data);

        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Oops!",
          description: "Failed to send the Message :(",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
    }
  };

  //* Type Handler
  const typeHandler = (event) => {
    setNewMessage(event.target.value);

    //typing animation code
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    //debounce/throttle function
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stoptyping", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  //* Get Messages Handler
  const getMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        baseURL: process.env.REACT_APP_SERVER_URL,
      };
      setLoading(true);

      const { data } = await axios.get(`/message/${selectedChat._id}`, config);

      setMessages(data);
      setLoading(false);
      socket.emit("joinchat", selectedChat._id);

      // socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Oops!",
        description: "Failed to load the messages :(",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stoptyping", () => setIsTyping(false));
  }, []);

  // TODO: Try other methods
  useEffect(() => {
    getMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("messagerecieved", (newMessage) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessage.chat._id
      ) {
        if (!notification.includes(newMessage)) {
          setNotification([newMessage, ...notification]);
          setGetAgain(!getAgain); //updating our chats in our my chats on newMessageRecieved
        }
      } else {
        setMessages([...messages, newMessage]);
      }
    });
  });

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            width="100%"
            // fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            {" "}
            <IconButton
              variant={"ghost"}
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIosNewRoundedIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroup ? (
              <>
                {istyping ? (
                  <div>
                    <Lottie
                      options={defaultOptions}
                      height={42}
                      width={50}
                      style={{ marginBottom: 0, marginLeft: 0 }}
                    />
                  </div>
                ) : (
                  <>{getSender(user, selectedChat.users)}</>
                )}

                <ProfileModal
                  user={getSenderFull(user, selectedChat.users)}
                ></ProfileModal>
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  getAgain={getAgain}
                  setGetAgain={setGetAgain}
                  getMessages={getMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="white"
            width="100%"
            height="100%"
            borderRadius="20"
            overflowY="hidden"
          >
            {loading ? (
              <Box alignSelf={"center"} margin="auto" padding="15">
                <HashLoader color="#ff6b6b" size={"32"} />
              </Box>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "scroll",
                }}
              >
                <MessagesFeed messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendHandler} isRequired mt={3}>
              <Input
                variant={"filled"}
                bg="white"
                borderRadius={"full"}
                placeholder="Write a message..."
                value={newMessage}
                onChange={typeHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Text fontSize="3xl" pb={3}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;