import React from "react";
import { useGlobalContext } from "../context";
import FolderItem from "./FolderItem";
import "./folder-list.scss";

const FolderList = () => {
  const { folderList } = useGlobalContext();
  return (
    <div className="folder-list-container">
      {folderList.map((folder) => {
        return <FolderItem key={folder.id} {...folder} />;
      })}
    </div>
  );
};

export default FolderList;
