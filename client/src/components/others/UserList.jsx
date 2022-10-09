import React from "react";

import { Avatar, Box, Text } from "@chakra-ui/react";

const UserList = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#ff6b6b",
        color: "white",
      }}
      width="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="30px"
      marginTop={"10px"}
    >
      <Avatar mr={2} size="sm" cursor="pointer" name={user.name} />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs" opacity={"0.8"}>
          {" "}
          <b>@</b>
          {user.username}{" "}
        </Text>
      </Box>
    </Box>
  );
};

export default UserList;
