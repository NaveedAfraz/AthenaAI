import { useEffect } from "react";
import {
  Route,
  Routes
} from "react-router";
import { useNavigate, useLocation } from "react-router";
import Home from "../pages/home/home";
import Login from "../pages/login/login";
import Register from "../pages/register/register";
import Dashboard from '../pages/dashboard/dashnoard';
import Chat from "../pages/chat/chat";

import Layout from "./components/common/layouts/Home/navFoot";
import { useAuth } from "@clerk/clerk-react";
import "./app.css"
function App() {
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();
  const location = useLocation()
  useEffect(() => {
    if (userId && location.pathname === "/") {
      navigate("/dashboard");
    }
  }, [userId, isLoaded]);
  return (

    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="chats/:id" element={<Chat />} />
        </Route>
      </Route>
    </Routes>

  );
}

export default App;
