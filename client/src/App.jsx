import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Home from "./pages/HomePage";
import Chats from "./pages/ChatsPage";
import "./assets/fonts/yekan/yekan.css";

function App() {
  const { i18n } = useTranslation();
  document.body.dir = i18n.dir();
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
