import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Components/Home";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import UserRegister from "./Components/UserRegister";
import UserLogin from "./Components/UserLogin";

const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/" element={<UserLogin />} />
        </Routes>
        <ToastContainer />
      </Router>
    </DndProvider>
  );
};

export default App;
