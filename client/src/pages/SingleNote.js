import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { useGlobalContext } from "../context";
import "./single-note.scss";

const SingleNote = () => {
  const { currentNote, setUpdatedNote } = useGlobalContext();
  const { id, title, content, folderId } = currentNote;
  const [note, setNote] = useState(null);
  const [readerMode, setReaderMode] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    setNote(`${title}${content}`);
    inputRef.current.focus();
  }, [currentNote]);

  useEffect(() => {
    const inputArr = inputRef.current.value.split("\n");
    const newTitle = inputArr[0];
    console.log(newTitle);
    inputArr.shift();
    const newContent = inputRef.current.value.replace(newTitle, "");
    setUpdatedNote({
      id,
      title: newTitle,
      content: newContent,
      folderId,
    });
  }, [note]);

  return (
    <section className="note-content">
      <button onClick={() => setReaderMode(!readerMode)}>Toggle</button>
      {readerMode ? (
        <ReactMarkdown
          children={note.replace(/\n/gi, "\n &nbsp;")}
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
