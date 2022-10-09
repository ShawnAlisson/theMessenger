import { CloseIcon } from "@chakra-ui/icons";
import { Avatar, Box, Button, Text } from "@chakra-ui/react";

const UserBadge = ({ user, handleFunction }) => {
  return (
    <Box margin={2} alignContent="center" alignItems={"center"} display="flex">
      <Button
        size={"xs"}
        padding="1"
        bg="red"
        borderRadius={"30px"}
        mr="1"
        onClick={handleFunction}
      >
        <CloseIcon fontSize={"2xs"} color="white" />
      </Button>
      <Avatar name={user.name} size="sm" mr={1} />
      <Box>
        <Text fontSize={"sm"}>{user.name}</Text>
        <Text fontSize={"xs"}>@{user.id}</Text>
      </Box>
    </Box>
  );
};

export default UserBadge;
