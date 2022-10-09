import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";

import Signup from "../components/authentication/Signup";
import Login from "../components/authentication/Login";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) navigate("/chats");
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        padding="6px"
        d="flex"
        justifyContent="center"
        bg={"white"}
        width="100%"
        margin="40px 0 15px 0"
        borderRadius="20px"
        borderWidth="1px"
      >
        <Text fontSize="4xl" color="black">
          Challenjeu Messenger
        </Text>
        <Box>
          <Tabs variant="soft-rounded" colorScheme="facebook">
            <TabList mb="1em">
              <Tab width="50%">Log In</Tab>
              <Tab width="50%">Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Signup />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
