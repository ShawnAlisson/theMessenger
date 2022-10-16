import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaPredicate } from "react-media-hook";

import ChatContext from "./chatContext";

const ChatProvider = (props) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);

  const preferredTheme = useMediaPredicate("(prefers-color-scheme: dark)")
    ? "dark"
    : "light";

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("chakra-ui-color-mode", preferredTheme);
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) navigate("/");
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
