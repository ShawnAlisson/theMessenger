import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import { Box, ChakraProvider } from "@chakra-ui/react";
import HashLoader from "react-spinners/HashLoader";

import "./i18nextConf";
import "./index.css";
import App from "./App";
import ChatProvider from "./Context/chatProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <ChatProvider>
      <ChakraProvider>
        <Suspense
          fallback={
            <Box
              position="fixed"
              top="50%"
              right={"50%"}
              backdropFilter="auto"
              backdropBlur="8px"
            >
              <HashLoader size={"60px"} color="red" />
            </Box>
          }
        >
          <App />
        </Suspense>
      </ChakraProvider>
    </ChatProvider>
  </Router>
);
