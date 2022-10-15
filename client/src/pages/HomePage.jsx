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
  useColorMode,
  IconButton,
} from "@chakra-ui/react";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";

import Signup from "../components/authentication/Signup";
import Login from "../components/authentication/Login";
import LanguageSelector from "../components/others/LanguageSelector";

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const bg = useColorModeValue("white", "gray.800");
  const { toggleColorMode } = useColorMode();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) navigate("/chats");
  }, [navigate]);

  return (
    <>
      <Container maxW="xl" centerContent>
        <Box
          bg={bg}
          padding="6px"
          d="flex"
          justifyContent="center"
          width="100%"
          margin="40px 0 15px 0"
          borderRadius="20px"
        >
          <Text fontSize="4xl" textAlign="center" mb="5">
            {t("login_title")}
          </Text>
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
      </Container>
    </>
  );
};

export default Home;
