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
    <Link to={`/notes/${currentFolder.id}/${id}`} className="note-links">
      <article className={`container ${isActive && "active"}`}>
        <div className="note-list-item-outer-container">
          <div className="note-list-item-inner-container">
            <li onClick={() => findNote(id)}>
              <h3>
                {title === "# " || title.replaceAll(" ", "") === ""
                  ? "A wonderful new note"
                  : removeMarkdown(title)}
              </h3>
              <p className="note-desc-preview">
                {content
                  ? removeMarkdown(content)
                  : "Write away your sorrows..."}
              </p>
            </li>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default Note;
