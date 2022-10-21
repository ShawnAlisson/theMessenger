import React from "react";
import { useTranslation } from "react-i18next";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  ModalFooter,
  useColorMode,
  useColorModeValue,
  IconButton,
  Box,
} from "@chakra-ui/react";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";

import LanguageSelector from "./LanguageSelector";

const About = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const { toggleColorMode } = useColorMode();
  const bg = useColorModeValue("white", "gray.800");

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal size="xs" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent h="380px" bg={bg} borderRadius={"25px"} margin="5">
          <ModalHeader
            fontFamily={"Yekan"}
            mt="10"
            display="flex"
            flexDir={"column"}
            justifyContent="center"
            textAlign={"center"}
          >
            <Text>{t("about_text")}</Text>
            <Text dir="ltr">@support</Text>
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
          ></ModalBody>
          <ModalFooter fontFamily={"Yekan"} display={"flex"} flexDir="column">
            <Text>{t("made_with_love")}</Text>
            <Text>Ver 1.0 Beta (Build 221022)</Text>
            <Box display={"flex"} mt="3">
              <LanguageSelector />
              <IconButton
                onClick={toggleColorMode}
                variant="ghost"
                borderRadius={20}
              >
                <DarkModeRoundedIcon />
              </IconButton>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default About;
