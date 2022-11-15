import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Text,
  useToast,
  Link,
  Box,
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
  InputLeftElement,
  FormHelperText,
} from "@chakra-ui/react";

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import VpnKeyRoundedIcon from "@mui/icons-material/VpnKeyRounded";

const ResetModal = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [code, setCode] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState();
  const [visible, setVisible] = useState(1);
  const [buttonName, setButtonName] = useState();
  const [resend, setResend] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();

  //* Show Password Handler
  const handleShowClick = () => setShow(!show);

  const sendEmail = async () => {
    if (!email) {
      toast({
        title: "Please Enter the Email",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/user/sendResetPasswordCode`,
        { email }
      );
      toast({
        title: "Reset code sent to your email",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setResend(false);
      setTimeout(() => {
        setResend(true);
      }, 120000);
      setVisible(2);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Oops!",
        description: "Email is not valid!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!code) {
      toast({
        title: "Please Enter the Code",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/user/validateResetCode`,
        { email, code }
      );
      setVisible(3);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Oops!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const changePassword = async () => {
    if (!password || !confirmpassword) {
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
      setLoading(true);
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/user/changePassword`,
        {
          email,
          password,
        }
      );
      toast({
        title: "Password Changed Successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      onClose();
    } catch (error) {
      setLoading(false);
      toast({
        title: "Oops!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <>
      <Link onClick={onOpen}>{t("forgot_password")}</Link>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent m="5">
          <ModalHeader mt="10">{t("forgot_password")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {visible === 1 && (
              <Box>
                <FormControl id="email">
                  <FormLabel>{t("enter_email_for_reset")}</FormLabel>
                  <InputGroup>
                    <Input
                      borderRadius={"20px"}
                      variant="filled"
                      type="email"
                      value={email}
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
              </Box>
            )}
            {visible === 2 && (
              <Box>
                <Text>{t("enter_code")}</Text>
                <FormControl>
                  <Input
                    borderRadius={"25"}
                    variant="filled"
                    onChange={(event) => setCode(event.target.value)}
                  ></Input>
                  <FormHelperText>{t("spam_alert")}</FormHelperText>
                </FormControl>
              </Box>
            )}
            {visible === 3 && (
              <Box>
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
                        <Button h="1.75rem" size="xs" onClick={handleShowClick}>
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
                        <Button h="1.75rem" size="xs" onClick={handleShowClick}>
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
                        <Button h="1.75rem" size="xs" onClick={handleShowClick}>
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
                        <Button h="1.75rem" size="xs" onClick={handleShowClick}>
                          {show ? <ViewOffIcon /> : <ViewIcon />}
                        </Button>
                      )}
                    </InputLeftElement>
                  </InputGroup>
                </FormControl>
              </Box>
            )}
          </ModalBody>

          <ModalFooter mb="5" mt="5">
            <Box>
              {visible === 1 && (
                <Button
                  disabled={!email}
                  borderRadius={"25"}
                  colorScheme="blue"
                  onClick={() => sendEmail()}
                >
                  {t("send_code")}
                </Button>
              )}
            </Box>
            <Box
              w={visible === 2 ? "100%" : ""}
              display={"flex"}
              justifyContent={"space-between"}
            >
              {visible === 2 && (
                <Button
                  borderRadius={"25"}
                  colorScheme="blue"
                  display={!resend ? "none" : "flex"}
                  onClick={() => {
                    sendEmail();
                  }}
                >
                  {t("resend")}
                </Button>
              )}
              {visible === 2 && (
                <Button
                  borderRadius={"25"}
                  colorScheme="blue"
                  onClick={() => verifyCode()}
                >
                  {t("verify_code")}
                </Button>
              )}
            </Box>

            {visible === 3 && (
              <Button
                disabled={!password || !confirmpassword}
                borderRadius={"25"}
                colorScheme="blue"
                onClick={() => changePassword()}
              >
                {t("change_password")}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ResetModal;
