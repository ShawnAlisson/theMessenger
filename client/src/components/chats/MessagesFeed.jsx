import React, { useContext } from "react";

import ScrollableFeed from "react-scrollable-feed";
import { Avatar, useColorModeValue } from "@chakra-ui/react";

import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogics";
import ChatContext from "../../Context/chatContext";

const MessagesBox = ({ messages }) => {
  //* Context
  const { user } = useContext(ChatContext);

  const grey_chat_color = useColorModeValue("#d8d8d8", "#818181");
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message, i) => (
          <div style={{ display: "flex" }} key={message._id}>
            {(isSameSender(messages, message, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Avatar
                mt="7px"
                mr={1}
                size="sm"
                cursor="pointer"
                name={message.sender.name}
              />
            )}
            <span
              style={{
                direction: "rtl",

                color: `${message.sender._id === user._id ? "white" : "black"}`,
                backgroundColor: `${
                  message.sender._id === user._id ? "#1982FC" : grey_chat_color
                }`,

                marginLeft: isSameSenderMargin(messages, message, i, user._id),
                marginTop: isSameUser(messages, message, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {message.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default MessagesBox;
