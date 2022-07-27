import React from "react";
import { useGlobalContext } from "../context";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import "./add-button.scss";

const SearchBar = () => {
  const { setNotesList, setCurrentNote, currentFolder } = useGlobalContext();

  const navigate = useNavigate();

  const handleAddNote = () => {
    const newNote = {
      id: uuidv4(),
      title: "# ",
      content: "",
      folderId: currentFolder.id,
    };
    setNotesList((prevVal) => {
      return [...prevVal, newNote];
    });
    setCurrentNote(newNote);
    navigate(`/notes/${currentFolder.id}/${newNote.id}`);
  };

  return (
    <button className="add-btn" onClick={handleAddNote}>
      <Icon icon="akar-icons:plus" />
    </button>
  );
};

export default SearchBar;
