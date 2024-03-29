import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { useNavigate, Navigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useGlobalContext } from "../context";
import "./single-note.scss";

const SingleNote = () => {
  const {
    currentNote,
    setUpdatedNote,
    deleteNote,
    currentFolder,
    openEditor,
    setOpenEditor,
    setCurrentNote,
    isLoggedIn,
  } = useGlobalContext();

  const { id, title, content, folderId } = currentNote;
  const [note, setNote] = useState("");
  const [readerMode, setReaderMode] = useState(false);
  const [isNoteNull, setIsNoteNull] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    setIsNoteNull(Object.keys(currentNote).length === 0);
    if (Object.keys(currentNote).length !== 0) {
      setNote(`${title}${content}`);
      setOpenEditor(true);
      inputRef.current.focus();
    }
  }, [currentNote]);

  useEffect(() => {
    const inputArr = inputRef.current.value.split("\n");
    const newTitle = inputArr[0];
    inputArr.shift();
    const newContent = inputRef.current.value.replace(newTitle, "");
    setUpdatedNote({
      id,
      title: newTitle,
      content: newContent,
      folderId,
    });
  }, [note]);

  const handleDelete = () => {
    deleteNote(currentNote);
    navigate(`/notes/${currentFolder.id}`);
    setOpenEditor(false);
    setCurrentNote({});
  };

  const handleBack = () => {
    setOpenEditor(false);
    setCurrentNote({});
  };

  if (isNoteNull) {
    return <Navigate to="/" />;
  }
  return (
    <section
      className={`note-content ${openEditor && "on-mobile-show"} ${
        !isLoggedIn && "slim"
      }`}
    >
      <div className="note-btn-container">
        <span
          className={`note-icon ${openEditor && "on-mobile-show"}`}
          onClick={handleBack}
        >
          <Icon icon="heroicons:arrow-left-solid" />
        </span>
        <span
          className={`note-icon ${!readerMode && "active"}`}
          onClick={() => setReaderMode(!readerMode)}
        >
          <Icon icon="heroicons-outline:pencil-alt" />
        </span>
        <span className="note-icon" onClick={handleDelete}>
          <Icon icon="heroicons-outline:trash" />
        </span>
      </div>
      {readerMode ? (
        <ReactMarkdown
          children={note}
          remarkPlugins={[remarkGfm, remarkBreaks]}
          className="note-body-reader"
        />
      ) : (
        <textarea
          className="note-body-markdown"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          ref={inputRef}
        />
      )}
    </section>
  );
};

export default SingleNote;
