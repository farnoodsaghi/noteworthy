import React from "react";
import { useGlobalContext } from "../context";
import { Icon } from "@iconify/react";
import "./create-folder-button.scss";

const CreateFolderButton = () => {
  const { setIsSubmenuOpen, setSubmenuLocation, sidebarRef } =
    useGlobalContext();

  const handleClick = (e) => {
    setIsSubmenuOpen(true);
    const sidebarPosition =
      sidebarRef.current && sidebarRef.current.getBoundingClientRect();
    const position = e.target.getBoundingClientRect();
    const coordinates = {
      left: position.left,
      top: position.bottom + 3 - sidebarPosition.top,
    };
    setSubmenuLocation(coordinates);
  };

  return (
    <div className="sidebar-three-dots" onClick={handleClick}>
      <Icon icon="bi:three-dots-vertical" />
    </div>
  );
};

export default CreateFolderButton;
