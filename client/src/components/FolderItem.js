import React from "react";
import { useGlobalContext } from "../context";
import { Link } from "react-router-dom";
import "./folder-item.scss";

const FolderItem = ({ id, name }) => {
  const { getNoteByFolder, setCurrentFolder } = useGlobalContext();

  const handleClick = () => {
    setCurrentFolder({ id, name });
    getNoteByFolder(id);
  };

  return (
    <Link className="folder-link" to={`/notes/${id}`}>
      <div className="folder-item" onClick={handleClick}>
        <h2>{name}</h2>
      </div>
    </Link>
  );
};

export default FolderItem;
