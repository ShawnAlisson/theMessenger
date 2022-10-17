import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import ScrollableFeed from "react-scrollable-feed";
import { Avatar, Box, useColorModeValue } from "@chakra-ui/react";

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

  //* Color Modes
  const time_color = useColorModeValue("gray.800", "gray.300");
  const grey_chat_color = useColorModeValue("#d8d8d8", "#818181");

  const [showTime, setShowTime] = useState(false);

  const { t } = useTranslation();

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

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message, i) => (
          <>
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

                  color: `${
                    message.sender._id === user._id ? "white" : "black"
                  }`,
                  backgroundColor: `${
                    message.sender._id === user._id
                      ? "#1982FC"
                      : grey_chat_color
                  }`,

                  marginLeft: isSameSenderMargin(
                    messages,
                    message,
                    i,
                    user._id
                  ),
                  marginTop: isSameUser(messages, message, i, user._id)
                    ? 3
                    : 10,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                }}
              >
                {message.content}
              </span>
            </div>
            <div
              class="show"
              dir={message.sender._id === user._id ? "rtl" : "ltr"}
            >
              <Box
                onClick={() => setShowTime((showTime) => !showTime)}
                display={"flex"}
                fontSize="10"
                ml="12"
                mr="2"
                mt="0.2"
                mb="0.8"
                color={time_color}
              >
                {converToLocalTime(message.createdAt)[3]}:
                {converToLocalTime(message.createdAt)[4]}
                <div dir={message.sender._id === user._id ? "rtl" : "ltr"}>
                  <Box
                    display={showTime ? "flex" : "none"}
                    fontSize="10"
                    ml="2"
                    mr="2"
                    color={"gray.900"}
                  >
                    {converToLocalTime(message.createdAt)[0]}/
                    {converToLocalTime(message.createdAt)[1]}/
                    {converToLocalTime(message.createdAt)[2]}{" "}
                    {days[converToLocalTime(message.createdAt)[6]]}
                  </Box>
                </div>
              </Box>
            </div>
          </>
        ))}
    </ScrollableFeed>
  );
};

export default MessagesBox;
