import React, { useState } from "react";
import CreateFolderButton from "./CreateFolderButton";
import FolderList from "./FolderList";
import "./sidebar.scss";
import Submenu from "./Submenu";
import { useGlobalContext } from "../context";

const Sidebar = () => {
  const { toggleSidebar, setToggleSidebar, sidebarRef } = useGlobalContext();
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => {
    e.preventDefault();
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStart - touchEnd > 75) {
      setToggleSidebar(false);
    }
    e.preventDefault();
  };

  return (
    <section
      className={`sidebar ${toggleSidebar && "on-mobile-show"}`}
      onTouchStart={(e) => handleTouchStart(e)}
      onTouchMove={(e) => handleTouchMove(e)}
      onTouchEnd={() => handleTouchEnd()}
      onClick={() => setToggleSidebar(true)}
      ref={sidebarRef}
    >
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
