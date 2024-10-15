// import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/admin/dashboard/dashboard";
import Login from "./components/login/Login";
import Camera from "./components/camera/camera";
import ProjectSetting from "./components/admin/settings/projectSetting";
import Setting from "./components/supervisor/settings/setting";
import SupervisorDashBoard from "./components/supervisor/dashboard/SupervisorDashboard";
import "bootstrap/dist/css/bootstrap.css";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<Login />}></Route>
          <Route path="/admin" element={<Dashboard />}></Route>
          <Route path="/camera" element={<Camera />}></Route>
          <Route path="/supervisor" element={<SupervisorDashBoard />}></Route>
          <Route path="/supervisorSetting" element={<Setting />}></Route>
          <Route path="/projectSetting" element={<ProjectSetting />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
