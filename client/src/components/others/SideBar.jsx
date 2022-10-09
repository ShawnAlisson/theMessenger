import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Search2Icon, BellIcon } from "@chakra-ui/icons";
import HashLoader from "react-spinners/HashLoader";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

import ChatContext from "../../Context/chatContext";
import ProfileModal from "./ProfileModal";
import ChatLoading from "./ChatLoading";
import UserList from "./UserList";
import GroupChatModal from "../chats/GroupChatModal";
import { getSender } from "../../config/ChatLogics";
import About from "./About";

const SideBar = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const firstField = React.useRef();

  //* Context
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = useContext(ChatContext);

  //* Logout Handler
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  //* Search Handler Old
  // const searchHandler = async () => {
  //   if (!search) {
  //     toast({
  //       title: "Please Enter something in search",
  //       status: "warning",
  //       duration: 3000,
  //       isClosable: true,
  //       position: "top-right",
  //     });
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const config = {
  //       headers: { Authorization: `Bearer ${user.token}` },
  //       baseURL: process.env.REACT_APP_SERVER_URL,
  //     };

  //     const { data } = await axios.get(`/user?search=${search}`, config);

  //     setLoading(false);
  //     setSearchResult(data);
  //   } catch (error) {
  //     console.log(error.message);
  //     toast({
  //       title: "Error Occured!",
  //       description: "Failed to Load the Search Results",
  //       status: "error",
  //       duration: 3000,
  //       isClosable: true,
  //       position: "top-right",
  //     });
  //   }
  // };

  //* Search Handler New
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
      console.log(error.message);
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

  //* Access Chat Handler
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        baseURL: process.env.REACT_APP_SERVER_URL,
      };
      const { data } = await axios.post(`/chat`, { userId }, config);

      if (!chats.find((chat) => chat._id === data._id))
        setChats([data, ...chats]);
      //already existing check clause //newly created chat above the rest

      setSelectedChat(data);
      setSearch();
      setSearchResult();

      setLoadingChat(false);
      onClose(); //drawer close afterwards
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <>
      <Box
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        // height={"95vh"}
        padding="5px 10px 5px 10px"
        bg="white"
        color="black"
        borderRadius={{
          base: "25px 25px 0px 0px",
          md: "25px 25px 25px 25px",
        }}
      >
        <Box
          display="flex"
          width="100%"
          justifyContent={"space-between"}
          padding="5px"
        >
          <Menu>
            <MenuButton>
              <Avatar
                size={"sm"}
                cursor="pointer"
                name={user.name}
                // src={user.avatar}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <About user={user}>
                <MenuItem>About</MenuItem>
              </About>
              <MenuDivider />
              <MenuItem fontWeight="bold" color="black" onClick={logoutHandler}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
          <Box width="55%">
            <InputGroup onClick={onOpen}>
              <Input
                value="Search User"
                color={"grey"}
                type="button"
                borderRadius={"20px"}
                ml={"2"}
                onChange={(e) => setSearch(e.target.value)}
              ></Input>
              <InputRightElement width="2.9rem">
                {<Search2Icon color={"grey"} />}
              </InputRightElement>
            </InputGroup>
          </Box>
          <Box>
            <GroupChatModal>
              <Button variant={"ghost"} borderRadius="35">
                <GroupsRoundedIcon fontSize="large" />
              </Button>
            </GroupChatModal>
            <Menu>
              <MenuButton
                color={"blue.700"}
                _hover={{
                  // background: "#ff6b6b",
                  color: "#ff6b6b",
                }}
              >
                <NotificationBadge
                  count={notification.length}
                  effect={Effect.SCALE}
                />
                <BellIcon fontSize="2xl" margin={1} />
              </MenuButton>
              <MenuList pl={2} borderRadius="20">
                {!notification.length && "No New Messages"}
                {notification.map((notif) => (
                  <MenuItem
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotification(notification.filter((n) => n !== notif));
                    }}
                  >
                    {notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      : `New Message from ${getSender(user, notif.chat.users)}`}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Box>
        </Box>
      </Box>
      <Drawer
        placement="left"
        onClose={onClose}
        isOpen={isOpen}
        initialFocusRef={firstField}
      >
        <DrawerOverlay />
        <DrawerContent borderRadius="0px 25px 25px 0px">
          <DrawerHeader>
            {loadingChat ? (
              <HashLoader color="#ff6b6b" size={"32"} />
            ) : (
              <Text>Search User</Text>
            )}
          </DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody>
            <Box>
              <InputGroup>
                <Input
                  placeholder="Search by name or username"
                  borderRadius={"20px"}
                  ref={firstField}
                  value={search}
                  onChange={(event) => searchHandler(event.target.value)}
                ></Input>
                <InputRightElement width="2.9rem">
                  <Button
                    _hover={{
                      background: "#ff6b6b",
                      color: "white",
                    }}
                    h="1.75rem"
                    size="xs"
                    borderRadius={"20px"}
                  >
                    {<Search2Icon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Box>

            {loading ? (
              <ChatLoading />
            ) : (
              searchResult
                ?.slice(0, 6)
                .map((user) => (
                  <UserList
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideBar;
