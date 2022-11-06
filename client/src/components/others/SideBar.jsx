import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import InfoIcon from "@mui/icons-material/Info";

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
  useColorModeValue,
  useDisclosure,
  useToast,
  useColorMode,
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
import i18next from "i18next";

const SideBar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const toast = useToast();
  const { i18n, t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const firstField = React.useRef();

  const bg = useColorModeValue("white", "gray.800");

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
        bg={bg}
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

            <MenuList borderRadius={"20"} padding={2}>
              <ProfileModal user={user} detail={user.details}>
                <MenuItem justifyContent={"space-between"} borderRadius={"10"}>
                  {t("my_profile")}
                  <AccountCircleRoundedIcon />
                </MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem
                justifyContent={"space-between"}
                borderRadius={"10"}
                onClick={
                  i18n.language === "en"
                    ? () => i18n.changeLanguage("fa")
                    : () => i18n.changeLanguage("en")
                }
              >
                {i18n.language === "en" ? (
                  <Box display={"flex"}>
                    <Text>Persian</Text>
                    <Text ml="1" mr="1">
                      |
                    </Text>
                    <Text color={"green.500"}> English</Text>
                  </Box>
                ) : (
                  <Box display={"flex"}>
                    <Text color="green.500">فارسی</Text>
                    <Text ml="1" mr="1">
                      |
                    </Text>
                    <Text> انگلیسی</Text>
                  </Box>
                )}

                <LanguageRoundedIcon />
              </MenuItem>
              <MenuItem
                borderRadius={"10"}
                onClick={toggleColorMode}
                justifyContent={"space-between"}
              >
                {colorMode === "light" ? t("dark_mode") : t("light_mode")}
                {colorMode === "light" ? (
                  <DarkModeRoundedIcon />
                ) : (
                  <LightModeRoundedIcon />
                )}
              </MenuItem>
              <About user={user}>
                <MenuItem borderRadius={"10"} justifyContent={"space-between"}>
                  {t("about")}
                  <InfoIcon />
                </MenuItem>
              </About>

              <MenuDivider />
              <MenuItem borderRadius={"10"} color="red" onClick={logoutHandler}>
                {t("logout")}
              </MenuItem>
            </MenuList>
          </Menu>
          <Box width="55%">
            <InputGroup onClick={onOpen}>
              <Input
                value={t("search_user")}
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
              <MenuList pl={2} borderRadius="20" padding={2}>
                <MenuItem borderRadius={"10"}>
                  {!notification.length ? (
                    t("no_new_message")
                  ) : (
                    <Text
                      onClick={() => {
                        setNotification([]);
                      }}
                    >
                      {t("clear_all_notif")}
                    </Text>
                  )}
                </MenuItem>

                {notification.map((notif) => (
                  <MenuItem
                    borderRadius={"10"}
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotification(notification.filter((n) => n !== notif));
                    }}
                  >
                    {notif.chat.isGroupChat
                      ? `${t("new_message_in")} ${notif.chat.chatName}`
                      : `${t("new_message_from")} ${getSender(
                          user,
                          notif.chat.users
                        )}`}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Box>
        </Box>
      </Box>
      <Drawer
        placement={i18next.dir() === "ltr" ? "left" : "right"}
        onClose={onClose}
        isOpen={isOpen}
        initialFocusRef={firstField}
      >
        <DrawerOverlay />
        <DrawerContent
          borderRadius={
            i18next.dir() === "ltr" ? "0px 25px 25px 0px" : "25px 0px 0px 25px"
          }
          fontFamily={"Yekan"}
        >
          <DrawerHeader mt={10}>
            {loadingChat ? (
              <HashLoader color="#ff6b6b" size={"32"} />
            ) : (
              <Text>{t("search_user")}</Text>
            )}
          </DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody>
            <Box>
              <InputGroup>
                <Input
                  placeholder={t("search_by_name_user")}
                  borderRadius={"20px"}
                  ref={firstField}
                  value={search}
                  onChange={(event) => searchHandler(event.target.value)}
                ></Input>
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
