import React from "react";
import CreateFolderButton from "./CreateFolderButton";
import FolderList from "./FolderList";
import "./sidebar.scss";

const Sidebar = () => {
  return (
    <section className="sidebar">
      <div className="logo-container">
        <h1 className="logo">noteworthy</h1>
        <CreateFolderButton />
      </div>
      <FolderList />
    </section>
  );
};

export default Sidebar;
