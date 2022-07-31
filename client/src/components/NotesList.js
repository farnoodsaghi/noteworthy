import React from "react";
import { useGlobalContext } from "../context";
import Note from "./Note";
import "./notes-list.scss";

const NotesList = () => {
  const { noteByFolderList } = useGlobalContext();

  return (
    <section className="note-list">
      <ul>
        {noteByFolderList.map((note) => {
          return <Note key={note.id} {...note} />;
        })}
      </ul>
    </section>
  );
};

export default NotesList;
