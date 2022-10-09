import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
        <FormLabel>Name</FormLabel>

        <Input
          variant="flushed"
          id="name"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl id="signup-email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          variant="flushed"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="signup-password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            variant="flushed"
            type={show ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="2.9rem">
            <Button h="1.75rem" size="xs" onClick={handleShowClick}>
              {show ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
        <FormHelperText>
          At least 8 characters(at least one lowercase, one uppercase, one
          numeric digit and one special character (!@#$%^&*).
        </FormHelperText>
      </FormControl>

      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            variant="flushed"
            type={show ? "text" : "password"}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="2.9rem">
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
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
