import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import { ChakraProvider } from "@chakra-ui/react";

import "./i18nextConf";
import "./index.css";
import App from "./App";
import ChatProvider from "./Context/chatProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <ChatProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </ChatProvider>
  </Router>
);
