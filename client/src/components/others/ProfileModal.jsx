import React, { useEffect, useState } from "react";
import axios from "axios";
import Moment from "react-moment";
import "moment/locale/fa";
import { useTranslation } from "react-i18next";

import "./style.css";

import {
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Text,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  Stack,
  InputLeftAddon,
  useColorModeValue,
  Box,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  useToast,
  ModalFooter,
  Textarea,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import VpnKeyRoundedIcon from "@mui/icons-material/VpnKeyRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import PersonPinCircleRoundedIcon from "@mui/icons-material/PersonPinCircleRounded";
import PasswordRoundedIcon from "@mui/icons-material/PasswordRounded";
import HistoryIcon from "@mui/icons-material/History";

import { AtSignIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const ProfileModal = ({ user, detail, children }) => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [currentPassword, setCurrentPassword] = useState();
  const [username, setUsername] = useState();

  const [users, setUsers] = useState();
  const [details, setDetails] = useState();

  const [remaining, setRemaining] = useState(140);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visiblity, setVisibility] = useState(1);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");

  const bg = useColorModeValue("white", "gray.800");
  const bg_light = useColorModeValue("gray.100", "gray.700");

  const navigate = useNavigate();
  const toast = useToast();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUsers(userInfo);
  }, []);

  useEffect(() => {
    setDetails(detail);
    setInfos(detail);
  }, [detail]);

  const initial = {
    bio: details?.bio ? details.bio : "",
    location: details?.location ? details.location : "",
    title: details?.title ? details.title : "",
    website: details?.website ? details.website : "",
  };
  const [infos, setInfos] = useState(initial);

  //* Update Profile Details Handler
  const updateDetailsHandler = async () => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/user/updatedetails`,
        {
          userId: user._id,
          infos,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setDetails(data);
      setVisibility(1);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const getProfileHandler = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/user/getprofile`,
        {
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  //* Bio Char Limit Handler
  const bioChangeHandler = (e) => {
    const { name, value } = e.target;
    setInfos({ ...infos, [name]: value });
    setRemaining(140 - e.target.value.length);
  };

  //* On Change Handler
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setInfos({ ...infos, [name]: value });
  };

  //* Show Password Handler
  const handleShowClick = () => setShow(!show);

  //* Update Password Handelr
  const updatePasswordHandler = async () => {
    setLoading(true);

    if (!password || !confirmpassword || !currentPassword) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmpassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        baseURL: process.env.REACT_APP_SERVER_URL,
      };

      var inputData = {
        userId: user._id,
        password,
        currentPassword,
      };

      await axios.post("/user/updatePassword", inputData, config);

      toast({
        title: "Password Changed",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error.message);
      toast({
        title: "Oops!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
    }
  };

  //* Submit Handler
  const submitHandler = async () => {
    if (visiblity === 4) {
      setLoading(true);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          baseURL: process.env.REACT_APP_SERVER_URL,
        };

        var inputData = {
          userId: user._id,
          name,
          email,
          username,
        };

        //* Remove empty inputs.
        Object.keys(inputData).forEach((key) => {
          if (!inputData[key]) delete inputData[key];
        });

        const { data } = await axios.post("/user/update", inputData, config);

        toast({
          title: "Updated Successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });

        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);
        window.location.reload();
      } catch (error) {
        console.log(error.message);
        toast({
          title: "Oops!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        setLoading(false);
      }
    } else {
      updateDetailsHandler();
    }
  };

  useEffect(() => {
    getProfileHandler();
  }, [details]);

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton variant={"ghost"} onClick={onOpen} borderRadius="20">
          <Avatar display={"flex"} name={user.name} />
        </IconButton>
      )}
      <Modal
        size={{ base: "full", md: "lg" }}
        onClose={onClose}
        isOpen={isOpen}
        scrollBehavior={scrollBehavior}
        isCentered
      >
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent
          // fontFamily={"Yekan"}
          h="380px"
          bg={bg}
          borderRadius={"25px"}
          height={"100%"}
        >
          <ModalHeader display="flex" justifyContent="center">
            <Avatar size="2xl" name={user.name} />
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
            fontSize="40px"
            // fontFamily="Work sans"
            // fontWeight="bold"
          >
            {visiblity === 1 && (
              <>
                <Box
                  display="flex"
                  flexDir="column"
                  alignItems={"center"}
                  dir="ltr"
                >
                  <Text fontSize={"3xl"}>{user.name}</Text>
                  <Box display={"flex"}>
                    {user.username && (
                      <Text fontSize={"sm"}>@{user.username}</Text>
                    )}
                  </Box>
                  {details?.bio && (
                    <Box
                      display={"flex"}
                      margin="3"
                      padding={3}
                      bg={bg_light}
                      borderRadius="20"
                      width={"100%"}
                    >
                      <Text dir="auto" wordBreak="break-word" fontSize={"sm"}>
                        {details?.bio}
                      </Text>
                    </Box>
                  )}

                  <Box display={"flex"}>
                    {details?.title && (
                      <Box display={"flex"} margin="3">
                        <WorkRoundedIcon />
                        <Text fontSize={"sm"}>{details.title}</Text>
                      </Box>
                    )}

                    {/* BIRTHDAY SHOULD BE ADDED */}
                    {/* SELECT DIFFERENT ICONS FOR TITLE */}

                    {details?.location && (
                      <Box display={"flex"} margin="3">
                        <PersonPinCircleRoundedIcon />
                        <Text fontSize={"sm"}>{details.location}</Text>
                      </Box>
                    )}

                    {details?.website && (
                      <Box margin="3" display={"flex"}>
                        <LinkRoundedIcon />
                        <Text fontSize={"sm"}>
                          <a
                            target="_blank"
                            href={`https://${details.website}`}
                          >
                            {details.website}
                          </a>
                        </Text>
                      </Box>
                    )}
                  </Box>
                </Box>
                {users?._id === user?._id && (
                  <Stack spacing={4} mb="10">
                    <Button
                      onClick={() => setVisibility(2)}
                      borderRadius="full"
                      padding={"6"}
                    >
                      {t("edit_profile")}
                    </Button>
                    <Button
                      onClick={() => setVisibility(4)}
                      borderRadius="full"
                      padding={"6"}
                    >
                      {t("acc_info")}
                    </Button>
                    <Button
                      onClick={() => setVisibility(3)}
                      borderRadius="full"
                      padding={"6"}
                    >
                      {t("security")}
                    </Button>
                  </Stack>
                )}
              </>
            )}

            {/* ACCOUNT INFORMATION */}
            {visiblity === 4 && (
              <>
                <Box>
                  <Stack spacing={4} padding="10">
                    <FormControl id="name" isRequired>
                      <FormLabel>{t("name")}</FormLabel>
                      <InputGroup>
                        <Input
                          borderRadius={20}
                          variant="filled"
                          id="name"
                          placeholder={user.name}
                          onChange={(e) => setName(e.target.value)}
                        />
                        <InputRightElement>
                          {i18n.dir() === "rtl" ? (
                            <AccountCircleRoundedIcon />
                          ) : (
                            ""
                          )}
                        </InputRightElement>
                        <InputLeftElement>
                          {i18n.dir() === "ltr" ? (
                            <AccountCircleRoundedIcon />
                          ) : (
                            ""
                          )}
                        </InputLeftElement>
                      </InputGroup>
                    </FormControl>

                    <FormControl id="edit-email" isRequired>
                      <FormLabel>{t("email")}</FormLabel>
                      <InputGroup>
                        <Input
                          borderRadius={20}
                          variant="filled"
                          type="email"
                          placeholder={user.email}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <InputRightElement>
                          {i18n.dir() === "rtl" ? <MailRoundedIcon /> : ""}
                        </InputRightElement>
                        <InputLeftElement>
                          {i18n.dir() === "ltr" ? <MailRoundedIcon /> : ""}
                        </InputLeftElement>
                      </InputGroup>
                    </FormControl>
                    <FormControl id="username" isRequired>
                      <FormLabel>{t("username")}</FormLabel>
                      <InputGroup>
                        <Input
                          borderRadius={20}
                          variant="filled"
                          type="username"
                          value={username}
                          placeholder={user.username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                        <InputRightElement>
                          {i18n.dir() === "rtl" ? <AtSignIcon /> : ""}
                        </InputRightElement>
                        <InputLeftElement>
                          {i18n.dir() === "ltr" ? <AtSignIcon /> : ""}
                        </InputLeftElement>
                      </InputGroup>
                    </FormControl>
                  </Stack>
                </Box>
                {user.createdAt && (
                  <Box display="flex" alignSelf={"center"}>
                    <HistoryIcon />

                    <Text fontSize="sm">
                      {t("joined")}
                      <Moment
                        fromNow
                        locale={i18n.language === "en" ? "en" : "fa"}
                      >
                        {user.createdAt}
                      </Moment>
                    </Text>
                  </Box>
                )}
              </>
            )}
            {/* EDIT PROFILE */}
            {visiblity === 2 && (
              <>
                <Box>
                  <Stack spacing={4} padding="10">
                    <FormControl id="bio" isRequired>
                      <FormLabel>{t("bio")}</FormLabel>
                      <InputGroup>
                        <Box width={"100%"}>
                          <Textarea
                            name="bio"
                            maxLength={140}
                            resize="none"
                            wordBreak="break-word"
                            dir="auto"
                            variant="filled"
                            borderRadius={20}
                            value={infos.bio}
                            placeholder={details.bio}
                            onChange={bioChangeHandler}
                          />
                          <Text
                            fontSize={"2xs"}
                            dir="rtl"
                            mr={3}
                          >{`${remaining}/140`}</Text>
                        </Box>

                        {/* <InputRightElement>
                          {i18n.dir() === "rtl" ? <ThreePRoundedIcon /> : ""}
                        </InputRightElement>
                        <InputLeftElement>
                          {i18n.dir() === "ltr" ? <ThreePRoundedIcon /> : ""}
                        </InputLeftElement> */}
                      </InputGroup>
                    </FormControl>
                    <FormControl id="website" isRequired>
                      <FormLabel>{t("website")}</FormLabel>
                      <InputGroup>
                        {i18n.dir() === "ltr" ? (
                          <InputLeftAddon
                            borderRadius={20}
                            children="https://"
                          />
                        ) : (
                          ""
                        )}
                        <Input
                          dir="ltr"
                          name="website"
                          variant="filled"
                          borderRadius={20}
                          type="website"
                          value={infos.website}
                          placeholder={details.website}
                          onChange={changeHandler}
                        />
                        {i18n.dir() === "rtl" ? (
                          <InputLeftAddon
                            borderRadius={20}
                            dir="ltr"
                            children="https://"
                          />
                        ) : (
                          ""
                        )}

                        {/* <InputRightElement>
                          {i18n.dir() === "rtl" ? <LinkRoundedIcon /> : ""}
                        </InputRightElement> */}
                        {/* <InputLeftElement>
                          {i18n.dir() === "ltr" ? <LinkRoundedIcon /> : ""}
                        </InputLeftElement> */}
                      </InputGroup>
                    </FormControl>
                    <FormControl id="location" isRequired>
                      <FormLabel>{t("location")}</FormLabel>
                      <InputGroup>
                        <Input
                          name="location"
                          variant="filled"
                          borderRadius={20}
                          value={infos.location}
                          // placeholder={infos.location}
                          onChange={changeHandler}
                        />
                        <InputRightElement>
                          {i18n.dir() === "rtl" ? (
                            <PersonPinCircleRoundedIcon />
                          ) : (
                            ""
                          )}
                        </InputRightElement>
                        <InputLeftElement>
                          {i18n.dir() === "ltr" ? (
                            <PersonPinCircleRoundedIcon />
                          ) : (
                            ""
                          )}
                        </InputLeftElement>
                      </InputGroup>
                    </FormControl>

                    <FormControl id="title" isRequired>
                      <FormLabel>{t("title")}</FormLabel>
                      <InputGroup>
                        <Input
                          variant="filled"
                          borderRadius={20}
                          name="title"
                          value={infos.title}
                          placeholder={details.title}
                          onChange={changeHandler}
                        />
                        <InputRightElement>
                          {i18n.dir() === "rtl" ? <WorkRoundedIcon /> : ""}
                        </InputRightElement>
                        <InputLeftElement>
                          {i18n.dir() === "ltr" ? <WorkRoundedIcon /> : ""}
                        </InputLeftElement>
                      </InputGroup>
                    </FormControl>
                  </Stack>
                </Box>
              </>
            )}

            {/* SECURITY */}
            {visiblity === 3 && (
              <>
                <Box>
                  <Stack spacing={4} padding="10">
                    <FormControl id="current-password" isRequired>
                      <FormLabel>{t("current_password")}</FormLabel>
                      <InputGroup>
                        <Input
                          variant="filled"
                          borderRadius={20}
                          type={show ? "text" : "password"}
                          placeholder={t("current_password")}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <InputRightElement
                          mr={i18n.dir() === "rtl" ? "0rem" : "0.3rem"}
                        >
                          {i18n.dir() === "rtl" ? (
                            <PasswordRoundedIcon />
                          ) : (
                            <Button
                              h="1.75rem"
                              size="xs"
                              onClick={handleShowClick}
                            >
                              {show ? <ViewOffIcon /> : <ViewIcon />}
                            </Button>
                          )}
                        </InputRightElement>
                        <InputLeftElement
                          ml={i18n.dir() === "rtl" ? "0.3rem" : "0rem"}
                        >
                          {i18n.dir() === "ltr" ? (
                            <PasswordRoundedIcon />
                          ) : (
                            <Button
                              h="1.75rem"
                              size="xs"
                              onClick={handleShowClick}
                            >
                              {show ? <ViewOffIcon /> : <ViewIcon />}
                            </Button>
                          )}
                        </InputLeftElement>
                      </InputGroup>
                    </FormControl>
                    <FormControl id="password" isRequired>
                      <FormLabel>{t("password")}</FormLabel>
                      <InputGroup>
                        <Input
                          variant="filled"
                          borderRadius={20}
                          type={show ? "text" : "password"}
                          placeholder={t("password")}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <InputRightElement
                          mr={i18n.dir() === "rtl" ? "0rem" : "0.3rem"}
                        >
                          {i18n.dir() === "rtl" ? (
                            <VpnKeyRoundedIcon />
                          ) : (
                            <Button
                              h="1.75rem"
                              size="xs"
                              onClick={handleShowClick}
                            >
                              {show ? <ViewOffIcon /> : <ViewIcon />}
                            </Button>
                          )}
                        </InputRightElement>
                        <InputLeftElement
                          ml={i18n.dir() === "rtl" ? "0.3rem" : "0rem"}
                        >
                          {i18n.dir() === "ltr" ? (
                            <VpnKeyRoundedIcon />
                          ) : (
                            <Button
                              h="1.75rem"
                              size="xs"
                              onClick={handleShowClick}
                            >
                              {show ? <ViewOffIcon /> : <ViewIcon />}
                            </Button>
                          )}
                        </InputLeftElement>
                      </InputGroup>
                      <FormHelperText>{t("password_helper")}</FormHelperText>
                    </FormControl>

                    <FormControl id="confirm-password" isRequired>
                      <FormLabel>{t("confirm_password")}</FormLabel>
                      <InputGroup>
                        <Input
                          variant="filled"
                          borderRadius={20}
                          type={show ? "text" : "password"}
                          placeholder={t("confirm_password")}
                          onChange={(e) => setConfirmpassword(e.target.value)}
                        />

                        <InputRightElement
                          mr={i18n.dir() === "rtl" ? "0rem" : "0.3rem"}
                        >
                          {i18n.dir() === "rtl" ? (
                            <VpnKeyRoundedIcon />
                          ) : (
                            <Button
                              h="1.75rem"
                              size="xs"
                              onClick={handleShowClick}
                            >
                              {show ? <ViewOffIcon /> : <ViewIcon />}
                            </Button>
                          )}
                        </InputRightElement>
                        <InputLeftElement
                          ml={i18n.dir() === "rtl" ? "0.3rem" : "0rem"}
                        >
                          {i18n.dir() === "ltr" ? (
                            <VpnKeyRoundedIcon />
                          ) : (
                            <Button
                              h="1.75rem"
                              size="xs"
                              onClick={handleShowClick}
                            >
                              {show ? <ViewOffIcon /> : <ViewIcon />}
                            </Button>
                          )}
                        </InputLeftElement>
                      </InputGroup>
                    </FormControl>
                  </Stack>
                </Box>
              </>
            )}
          </ModalBody>
          <ModalFooter justifyContent={"space-between"}>
            {visiblity !== 1 && (
              <Button
                borderRadius={20}
                padding={"5"}
                onClick={() => {
                  setPassword();
                  setConfirmpassword();
                  setCurrentPassword();
                  setName();
                  setEmail();
                  setUsername();
                  setVisibility(1);
                }}
              >
                {t("back")}
              </Button>
            )}

            {visiblity !== 1 && (
              <Button
                borderRadius={20}
                variant="outline"
                colorScheme="teal"
                disabled={
                  visiblity === 3
                    ? !currentPassword || !password || !confirmpassword
                    : !username?.trim() &&
                      !name?.trim() &&
                      !email?.trim() &&
                      visiblity === 4
                }
                onClick={() => {
                  visiblity === 3 ? updatePasswordHandler() : submitHandler();
                }}
              >
                {t(visiblity === 3 ? "update_password" : "submit")}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
