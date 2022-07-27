import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(null);

const AppProvider = ({ children }) => {
  const [searchInput, setSearchInput] = useState("");
  const [notesList, setNotesList] = useState([]);
  const [currentNote, setCurrentNote] = useState({});
  const [updatedNote, setUpdatedNote] = useState({});

  const findNote = (id) => {
    const note = notesList.find((note) => {
      return note.id === id;
    });
    setCurrentNote(note);
  };

  const editNote = (myNote) => {
    const { id, title, content } = myNote;
    setNotesList((prev) => {
      return prev.map((note) => {
        if (note.id === id) {
          return { id, title, content };
        }
        return note;
      });
    });
  };

  useEffect(() => {
    editNote(updatedNote);
  }, [updatedNote]);
  return (
    <AppContext.Provider
      value={{
        setSearchInput,
        searchInput,
        notesList,
        setNotesList,
        findNote,
        currentNote,
        setCurrentNote,
        setUpdatedNote,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppProvider, useGlobalContext };
