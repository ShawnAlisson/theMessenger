import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  useColorModeValue,
  SimpleGrid,
} from "@chakra-ui/react";

import Signup from "../components/authentication/Signup";
import Login from "../components/authentication/Login";
import Footer from "../components/others/Footer";

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const bg = useColorModeValue("white", "gray.800");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) navigate("/chats");
  }, [navigate]);

  return (
    <Container maxW="6xl" centerContent>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2} width="100%">
        <Box width="100%" mt={{ base: "", md: "150" }}>
          <Text fontSize="4xl" textAlign="center" mb="5">
            {t("login_title")}
          </Text>
        </Box>
        <Box
          display="flex"
          flexDir={"column"}
          width="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            bg={bg}
            padding="6px"
            // display="flex"
            maxW={"lg"}
            justifyContent="center"
            width="100%"
            margin="40px 0 15px 0"
            borderRadius="20px"
          >
            <Box>
              <Tabs variant="soft-rounded" colorScheme="facebook">
                <TabList mb="1em">
                  <Tab width="50%">{t("login")}</Tab>
                  <Tab width="50%">{t("signup")}</Tab>
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

          <Footer />
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default Home;
