import React, { useContext, useState } from "react";
import axios from "axios";

import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

import ChatContext from "../../Context/chatContext";
import UserBadge from "../others/UserBadge";
import UserList from "../others/UserList";
import { t } from "i18next";

const UpdateGroupChatModal = (getAgain, setGetAgain, getMessages) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const toast = useToast();
  const bg = useColorModeValue("white", "gray.800");

  //* Context
  const { selectedChat, setSelectedChat, user } = useContext(ChatContext);

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
      //   console.log(data, "users search response from server");

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.error(error.message);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  //* Add Handler
  const addHandler = async (selectedUser) => {
    if (
      selectedChat.users.find(
        (existingUser) => existingUser._id === selectedUser._id
      )
    ) {
      toast({
        title: "This user is already in group.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      //admin is not loggedIn user clause
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        baseURL: process.env.REACT_APP_SERVER_URL,
      };

      const { data } = await axios.put(
        `/chat/group/add`,
        {
          chatId: selectedChat._id,
          userId: selectedUser._id,
        },
        config
      );

      setSelectedChat(data);
      console.log(data, "added user data response");

      setGetAgain(!getAgain);
      setLoading(false);
    } catch (error) {
      console.log(error.message);

      toast({
        title: "Oops!",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  //* Rename Handler
  const renameHandler = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        baseURL: process.env.REACT_APP_SERVER_URL,
      };

      const { data } = await axios.put(
        `/chat/group/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName, //local state
        },
        config
      );

      // console.log(data);
      // setSelectedChat("");
      setSelectedChat(data);

      // TODO: setGetAgain(!getAgain);

      window.location.reload();
      setRenameLoading(false);
    } catch (error) {
      // console.log(error);
      // console.log(error.response);
      toast({
        title: "Oops!",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      setRenameLoading(false);
    }
    setGroupChatName(""); //reseting the new name field
  };

  //* Remove Handler
  const removeHandler = async (selectedUser) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      selectedUser._id !== user._id
    ) {
      toast({
        title: "User could not be removed",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        baseURL: process.env.REACT_APP_SERVER_URL,
      };

      const { data } = await axios.put(
        `/chat/group/remove`,
        {
          chatId: selectedChat._id,
          userId: selectedUser._id,
        },
        config
      );

      // Leaving Chat / Removing Member
      selectedUser._id === user._id ? setSelectedChat() : setSelectedChat(data);

      setGetAgain(!getAgain);
      getMessages(); //prop passsed down from singlechat //opt
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <>
      <IconButton
        display={"flex"}
        variant={"ghost"}
        icon={<MenuRoundedIcon />}
        onClick={onOpen}
      ></IconButton>

      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent
          bg={bg}
          borderRadius={"25px"}
          margin="5"
          fontFamily={"Yekan"}
        >
          <ModalHeader
            display="flex"
            justifyContent="center"
            width={"80%"}
            mt="5"
          >
            <Text noOfLines="1">{selectedChat.chatName}</Text>
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <Box display={"flex"} w="100%" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((selectedChat) => (
                <UserBadge
                  key={selectedChat._id}
                  user={selectedChat}
                  handleFunction={() => removeHandler(selectedChat)}
                />
              ))}
            </Box>
            <FormControl display={"flex"}>
              <Input
                borderRadius={25}
                placeholder={t("group_name")}
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                borderRadius={25}
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={renameHandler}
              >
                {t("update")}
              </Button>
            </FormControl>
            <FormControl>
              <Input
                borderRadius={25}
                placeholder={t("add_user_to_group")}
                onChange={(e) => searchHandler(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((selectedUser) => (
                  <UserList
                    key={selectedUser._id}
                    user={selectedUser}
                    handleFunction={() => addHandler(selectedUser)}
                  />
                ))
            )}
            <Button
              variant="outline"
              borderWidth={2}
              borderRadius={25}
              onClick={() => removeHandler(user)}
              colorScheme="red"
              mt="5"
            >
              {t("leave_group")}
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
