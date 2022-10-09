import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import Chats from "./pages/ChatsPage";

function App() {
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
