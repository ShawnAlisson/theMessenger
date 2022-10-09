import React from "react";
import { Skeleton, Stack } from "@chakra-ui/react";

const ChatLoading = () => {
  return (
    <Stack padding={"10px"}>
      <Skeleton height={"45px"} borderRadius="25px"></Skeleton>
      <Skeleton height={"45px"} borderRadius="25px"></Skeleton>
      <Skeleton height={"45px"} borderRadius="25px"></Skeleton>
      <Skeleton height={"45px"} borderRadius="25px"></Skeleton>
      <Skeleton height={"45px"} borderRadius="25px"></Skeleton>
      <Skeleton height={"45px"} borderRadius="25px"></Skeleton>
      <Skeleton height={"45px"} borderRadius="25px"></Skeleton>
      <Skeleton height={"45px"} borderRadius="25px"></Skeleton>
      <Skeleton height={"45px"} borderRadius="25px"></Skeleton>
      <Skeleton height={"45px"} borderRadius="25px"></Skeleton>
      <Skeleton height={"45px"} borderRadius="25px"></Skeleton>
      <Skeleton height={"45px"} borderRadius="25px"></Skeleton>
      <Skeleton height={"45px"} borderRadius="25px"></Skeleton>
    </Stack>
  );
};

export default ChatLoading;
