import React from "react";
import { useGlobalContext } from "../context";
import FolderItem from "./FolderItem";

const FolderList = () => {
  const { folderList } = useGlobalContext();
  return (
    <div>
      {folderList.map((folder) => {
        return <FolderItem key={folder.id} {...folder} />;
      })}
    </div>
  );
};

export default FolderList;
