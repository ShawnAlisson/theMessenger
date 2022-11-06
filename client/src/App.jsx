import React from "react";
import { Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "./App.css";
import Home from "./pages/HomePage";
import "./assets/fonts/yekan/yekan.css";
// import { regSw, subscribe } from "./config/subscriptionHelper";

const Chats = React.lazy(() => import("./pages/ChatsPage"));

function App() {
  const { i18n } = useTranslation();
  document.body.dir = i18n.dir();

  //TODO: WEB PUSH NOTIFICATION
  // async function registerAndSubscribe() {
  //   try {
  //     const serviceWorkerReg = await regSw();
  //     await subscribe(serviceWorkerReg);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  return (
    <div className="App">
      <Routes>
        {/* <Route path="/login/" element={<Login />} exact /> */}
        <Route path="/" element={<Home />} exact />
        <Route path="/chats/" element={<Chats />} exact />
      </Routes>
    </div>
  );
}

export default App;
