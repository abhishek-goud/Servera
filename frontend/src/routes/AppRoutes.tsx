import Home from "@/screens/Home";
import Login from "@/screens/Login";
import Register from "@/screens/Register";
import { BrowserRouter, Route, Routes } from "react-router";
import ProjectContent from "@/screens/ProjectContent";
import UserAuth from "@/auth/UserAuth";
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserAuth><Home/></UserAuth>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/project" element={<UserAuth><ProjectContent/></UserAuth>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
