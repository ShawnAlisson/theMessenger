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
  FormHelperText,
  InputLeftElement,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const Signup = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  //* Show Password Handler
  const handleShowClick = () => setShow(!show);

  //* Submit Handler
  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmpassword) {
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
        headers: { "Content-type": "application/json" },
        baseURL: process.env.REACT_APP_SERVER_URL,
      };

      const { data } = await axios.post(
        "/user/register",
        { name, email, password },
        config
      );

      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
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

  return (
    <VStack spacing="5px">
      <FormControl id="name" isRequired>
        <FormLabel>{t("name")}</FormLabel>

        <Input
          variant="flushed"
          id="name"
          placeholder={t("name")}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl id="signup-email" isRequired>
        <FormLabel>{t("email")}</FormLabel>
        <Input
          variant="flushed"
          type="email"
          placeholder={t("email")}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="signup-password" isRequired>
        <FormLabel>{t("password")}</FormLabel>
        <InputGroup>
          <Input
            variant="flushed"
            type={show ? "text" : "password"}
            placeholder={t("password")}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement mr={i18n.dir() === "ltr" ? "0.3rem" : "28.5rem"}>
            <Button h="1.75rem" size="xs" onClick={handleShowClick}>
              {show ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
        <FormHelperText>{t("password_helper")}</FormHelperText>
      </FormControl>

      <FormControl id="confirm-password" isRequired>
        <FormLabel>{t("confirm_password")}</FormLabel>
        <InputGroup>
          <Input
            variant="flushed"
            type={show ? "text" : "password"}
            placeholder={t("confirm_password")}
            onChange={(e) => setConfirmpassword(e.target.value)}
          />

          <InputRightElement mr={i18n.dir() === "ltr" ? "0.3rem" : "28.5rem"}>
            <Button h="1.75rem" size="xs" onClick={handleShowClick}>
              {show ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
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
      >
        {t("signup")}
      </Button>
    </VStack>
  );
};

export default Signup;
