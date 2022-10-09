import React from "react";

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
} from "@chakra-ui/react";

const About = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal size="xs" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent h="380px" bg="white" borderRadius={"25px"} margin="5">
          <ModalHeader display="flex" justifyContent="center">
            <Text>
              Found a bug? 🐞 you can report it or make your suggestions to
              @support 🥳
            </Text>
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
          <ModalFooter>
            <Text>Made with 💜 Ver 1.0 Beta (Build 220910)</Text>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default About;
