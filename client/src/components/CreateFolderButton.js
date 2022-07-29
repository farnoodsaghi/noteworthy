import React from "react";
import { useGlobalContext } from "../context";
import { Icon } from "@iconify/react";
import "./create-folder-button.scss";

const CreateFolderButton = () => {
  const { setIsModalVisible } = useGlobalContext();

  return (
    <div className="sidebar-three-dots" onClick={() => setIsModalVisible(true)}>
      <Icon icon="bi:three-dots-vertical" />
    </div>
  );
};

export default CreateFolderButton;
