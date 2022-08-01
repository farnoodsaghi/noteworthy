import React from "react";
import { useGlobalContext } from "../context";
import { Icon } from "@iconify/react";
import "./create-folder-button.scss";

const CreateFolderButton = () => {
  const { setIsModalVisible, setIsSubmenuOpen, setSubmenuLocation } =
    useGlobalContext();

  const handleClick = (e) => {
    // setIsModalVisible(true);
    setIsSubmenuOpen(true);
    const position = e.target.getBoundingClientRect();
    const coordinates = { left: position.left, top: position.bottom + 3 };
    setSubmenuLocation(coordinates);
  };

  return (
    <div className="sidebar-three-dots" onClick={handleClick}>
      <Icon icon="bi:three-dots-vertical" />
    </div>
  );
};

export default CreateFolderButton;
