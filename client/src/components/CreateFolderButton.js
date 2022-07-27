import React from "react";
import { useGlobalContext } from "../context";

const CreateFolderButton = () => {
  const { setIsModalVisible } = useGlobalContext();

  return <button onClick={() => setIsModalVisible(true)}>Create Folder</button>;
};

export default CreateFolderButton;
