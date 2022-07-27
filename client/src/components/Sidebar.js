import React from "react";
import CreateFolderButton from "./CreateFolderButton";
import FolderList from "./FolderList";
import "./sidebar.scss";

const Sidebar = () => {
  return (
    <section className="sidebar">
      <h2>Sidebar</h2>
      <CreateFolderButton />
      <FolderList />
    </section>
  );
};

export default Sidebar;
