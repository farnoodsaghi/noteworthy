import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context";
import { Link } from "react-router-dom";
import "./note.scss";
import removeMarkdown from "remove-markdown";

const Note = ({ id, title, content }) => {
  const { findNote, currentNote, currentFolder } = useGlobalContext();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (currentNote.id === id) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [currentNote]);

  return (
    <article className={`container ${isActive && "active"}`}>
      <Link to={`/notes/${currentFolder.id}/${id}`} className="note-links">
        <div className="note-list-item-container">
          <li onClick={() => findNote(id)}>
            <h3>
              {title === "# " || title.replaceAll(" ", "") === ""
                ? "A wonderful new note"
                : removeMarkdown(title)}
            </h3>
            <p className="note-desc-preview">
              {content ? removeMarkdown(content) : "Write away your sorrows..."}
            </p>
          </li>
        </div>
      </Link>
    </article>
  );
};

export default Note;
