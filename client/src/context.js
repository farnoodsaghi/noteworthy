import { createContext, useContext, useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

const AppContext = createContext(null);

const AppProvider = ({ children }) => {
  const defaultFolderRef = useRef({
    id: uuidv4(),
    name: "All Notes",
  });
  const [searchInput, setSearchInput] = useState("");
  const [notesList, setNotesList] = useState([]);
  const [currentNote, setCurrentNote] = useState({});
  const [updatedNote, setUpdatedNote] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(defaultFolderRef.current);
  const [noteByFolderList, setNoteByFolderList] = useState([]);
  const [folderList, setFolderList] = useState([defaultFolderRef.current]);
  const notesRefList = useRef(noteByFolderList);

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
      const list =
        defaultFolderRef.current.id === id
          ? notesList
          : notesList.filter((note) => {
              return note.folderId === id;
            });

      notesRefList.current = list;
      return list;
    });
  };

  const searchNote = () => {
    console.log(searchInput);
    searchInput
      ? setNoteByFolderList(() => {
          return notesRefList.current.filter((note) => {
            const { title, content } = note;
            return (
              title.toLowerCase().includes(searchInput.toLowerCase()) ||
              content.toLowerCase().includes(searchInput.toLowerCase())
            );
          });
        })
      : getNoteByFolder(currentFolder.id);
  };

  useEffect(() => {
    editNote(updatedNote);
  }, [updatedNote]);

  useEffect(() => {
    getNoteByFolder(currentFolder.id);
  }, [notesList]);

  useEffect(() => {
    searchNote();
  }, [searchInput]);

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
        searchNote,
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
