import React from "react";

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
} from "@chakra-ui/react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { AtSignIcon } from "@chakra-ui/icons";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue("white", "gray.800");

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton variant={"ghost"} onClick={onOpen} borderRadius="20">
          <Avatar display={"flex"} name={user.name} />
        </IconButton>
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent h="380px" bg={bg} borderRadius={"25px"} margin="5">
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
            <Stack spacing={4} dir="ltr">
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<AccountCircleIcon color="gray.300" />}
                />

                <Input value={user.name} disabled />
              </InputGroup>

              <InputGroup>
                {/* <InputLeftElement
                  pointerEvents="none"
                  children={<AccountCircleIcon color="gray.300" />}
                /> */}
                <InputLeftElement
                  pointerEvents="none"
                  children={<AtSignIcon color="gray.300" />}
                />
                <Input value={user.username} disabled />
              </InputGroup>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
