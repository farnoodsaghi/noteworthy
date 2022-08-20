import React from "react";
import axios from "axios";
import { useGlobalContext } from "../context";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import "./add-button.scss";

const SearchBar = () => {
  const { setNotesList, setCurrentNote, currentFolder, isLoggedIn } =
    useGlobalContext();

  const navigate = useNavigate();

  const handleAddNote = async () => {
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

    if (isLoggedIn) {
      const { id, title, content } = newNote;
      try {
        const response = await axios.post(
          `http://localhost:6000/dashboard/notes/${currentFolder.id}`,
          JSON.stringify({ noteId: id, title, content }),
          {
            headers: {
              "Content-Type": "application/json",
              token: localStorage.token,
            },
          }
        );
      } catch (e) {
        console.log(e.response);
      }
    }
  };

  return (
    <button className="add-btn" onClick={handleAddNote}>
      <Icon icon="akar-icons:plus" />
    </button>
  );
};

export default SearchBar;
