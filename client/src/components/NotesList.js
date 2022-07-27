import React from "react";
import { useGlobalContext } from "../context";
import Note from "./Note";

const NotesList = () => {
  const { notesList } = useGlobalContext();

  return (
    <section className="note-list">
      <ul>
        {notesList.map((note) => {
          return <Note key={note.id} {...note} />;
        })}
      </ul>
    </section>
  );
};

export default NotesList;
