import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import SignupPrompt from "../components/SignupPrompt";

const SharedLayout = () => {
  return (
    <>
      <SignupPrompt />
      <Sidebar />
      <Outlet />
    </>
  );
};

export default SharedLayout;
