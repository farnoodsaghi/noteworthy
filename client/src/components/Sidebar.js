import React from "react";
import CreateFolderButton from "./CreateFolderButton";
import FolderList from "./FolderList";
import "./sidebar.scss";
import Submenu from "./Submenu";

const Sidebar = () => {
  return (
    <section className="sidebar">
      <div className="logo-container">
        <h1 className="logo">noteworthy</h1>
        <CreateFolderButton />
        <Submenu />
      </div>
      <FolderList />
    </section>
  );
};

export default Sidebar;
