import React, { useState, useContext } from "react";
import axios from "axios";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
} from "@chakra-ui/react";
import HashLoader from "react-spinners/HashLoader";

import ChatContext from "../../Context/chatContext";
import UserList from "../others/UserList";
import UserBadge from "../others/UserBadge";

const GroupChatModal = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  //* Context
  const { user, chats, setChats } = useContext(ChatContext);

  //* Selected Group Handler
  const selectedGroupHandler = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User is already a member of group",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  //* Search Handler
  const searchHandler = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        baseURL: process.env.REACT_APP_SERVER_URL,
      };

      const { data } = await axios.get(`/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.error(error.message);
      toast({
        title: "Oops!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  //* Delete Handler
  const deleteHandler = (delUser) => {
    setSelectedUsers(
      selectedUsers.filter((selectedUser) => selectedUser._id !== delUser._id)
    );
  };

  //* Submit Handler
  const submitHandler = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {
          /* "Content-type": "application/json", */ Authorization: `Bearer ${user.token}`,
        }, //already body jsonType
        baseURL: process.env.REACT_APP_SERVER_URL,
      };

      const { data } = await axios.post(
        `chat/group/create`,
        {
          name: groupChatName,
          users: JSON.stringify(
            selectedUsers.map((selectedUser) => selectedUser._id)
          ),
          //server side req.body accepts stringify array of user id
        },
        config
      );

      setChats([data, ...chats]); //recently created chat first
      console.log(data, "group chat added/created respopnse");
      onClose(); //modal close on success

      toast({
        title: "New Group Created!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      console.error(error.message);
      toast({
        title: "Failed to Create the Group!",
        description: error.response.data,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent borderRadius={"25"} margin="5">
          <ModalHeader
            fontSize="35px"
            // fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            New Group
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                borderRadius={"25"}
                placeholder="Group Name"
                mb={3}
                onChange={(event) => setGroupChatName(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                borderRadius={"25"}
                placeholder="Who would you like to add?"
                mb={1}
                onChange={(event) => searchHandler(event.target.value)}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((selectedUser) => (
                <UserBadge
                  key={selectedUser._id}
                  user={selectedUser}
                  handleFunction={() => deleteHandler(selectedUser)}
                />
              ))}
            </Box>
            {loading ? (
              <HashLoader color="#ff6b6b" size={"32"} />
            ) : (
              //top 4 results
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserList
                    key={user._id}
                    user={user}
                    handleFunction={() => selectedGroupHandler(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              borderRadius={"25px"}
              onClick={submitHandler}
              colorScheme="blue"
            >
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
