import { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const AppContext = createContext(null);

const AppProvider = ({ children }) => {
  const [defaultFolder, setDefaultFolder] = useState({
    id: uuidv4(),
    name: "All Notes",
  });
  const [searchInput, setSearchInput] = useState("");
  const [notesList, setNotesList] = useState([]);
  const [currentNote, setCurrentNote] = useState({});
  const [updatedNote, setUpdatedNote] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(defaultFolder);
  const [noteByFolderList, setNoteByFolderList] = useState([]);
  const [folderList, setFolderList] = useState([defaultFolder]);

  const findNote = (id) => {
    const note = notesList.find((note) => {
      return note.id === id;
    });
    setCurrentNote(note);
  };

  const editNote = (myNote) => {
    const { id, title, content, folderId } = myNote;
    setNotesList((prev) => {
      return prev.map((note) => {
        if (note.id === id) {
          return { id, title, content, folderId };
        }
        return note;
      });
    });
  };

  const getNoteByFolder = (id) => {
    setNoteByFolderList(() => {
      if (defaultFolder.id === id) {
        return notesList;
      }
      return notesList.filter((note) => {
        return note.folderId === id;
      });
    });
  };

  useEffect(() => {
    editNote(updatedNote);
  }, [updatedNote]);

  useEffect(() => {
    getNoteByFolder(currentFolder.id);
  }, [notesList]);

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
        folderList,
        setFolderList,
        setIsModalVisible,
        isModalVisible,
        getNoteByFolder,
        noteByFolderList,
        setCurrentFolder,
        currentFolder,
        defaultFolder,
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
