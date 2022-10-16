import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
  InputLeftElement,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import HashLoader from "react-spinners/HashLoader";
import VpnKeyRoundedIcon from "@mui/icons-material/VpnKeyRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";

// import ChatContext from "../../Context/chatContext";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // const { setUser } = useContext(ChatContext);

  //* Show Password Handler
  const handleShowClick = () => setShow(!show);

  //* Submit Handler
  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
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

    try {
      const config = {
        headers: { "Content-type": "application/json" },
        baseURL: process.env.REACT_APP_SERVER_URL,
      };

      const { data } = await axios.post(
        "/user/login",
        { email, password },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));

      // const userInfo = JSON.parse(localStorage.getItem("userInfo")); //store the data from localstorage
      // setUser(userInfo); //set the data

      setLoading(false);
      navigate("/chats");
    } catch (error) {
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

  return (
    <VStack spacing="5px">
      <FormControl id="email" isRequired>
        <FormLabel>{t("email")}</FormLabel>
        <InputGroup>
          <Input
            borderRadius={"20px"}
            variant="filled"
            type="email"
            placeholder={t("email")}
            onChange={(event) => setEmail(event.target.value)}
          />
          <InputRightElement>
            {i18n.dir() === "rtl" ? <MailRoundedIcon /> : ""}
          </InputRightElement>
          <InputLeftElement>
            {i18n.dir() === "ltr" ? <MailRoundedIcon /> : ""}
          </InputLeftElement>
        </InputGroup>
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>{t("password")}</FormLabel>
        <InputGroup>
          <Input
            borderRadius={"20px"}
            variant="filled"
            type={show ? "text" : "password"}
            placeholder={t("password")}
            onChange={(event) => setPassword(event.target.value)}
          />

          <InputRightElement mr={i18n.dir() === "rtl" ? "0rem" : "0.3rem"}>
            {i18n.dir() === "rtl" ? (
              <VpnKeyRoundedIcon />
            ) : (
              <Button h="1.75rem" size="xs" onClick={handleShowClick}>
                {show ? <ViewOffIcon /> : <ViewIcon />}
              </Button>
            )}
          </InputRightElement>
          <InputLeftElement ml={i18n.dir() === "rtl" ? "0.3rem" : "0rem"}>
            {i18n.dir() === "ltr" ? (
              <VpnKeyRoundedIcon />
            ) : (
              <Button h="1.75rem" size="xs" onClick={handleShowClick}>
                {show ? <ViewOffIcon /> : <ViewIcon />}
              </Button>
            )}
          </InputLeftElement>
        </InputGroup>
      </FormControl>

      <Button
        borderRadius={"20px"}
        fontWeight="bold"
        colorScheme="blue"
        width="60%"
        style={{ marginTop: 15, fontWeight: "bold" }}
        onClick={submitHandler}
        isLoading={loading}
        spinner={<HashLoader size={24} color="white" />}
      >
        {t("login")}
      </Button>
    </VStack>
  );
};

export default Login;
