import { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
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
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [submenuLocation, setSubmenuLocation] = useState({});
  const [loginModal, setLoginModal] = useState(false);
  const [signupModal, setSignupModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const findNote = (id) => {
    const note = noteByFolderList.find((note) => {
      return note.id === id;
    });
    setCurrentNote(note);
  };

  const editNote = async (myNote) => {
    const { id, title, content, folderId } = myNote;

    setNotesList((prev) => {
      return prev.map((note) => {
        if (note.id === id) {
          return { id, title, content, folderId };
        }
        return note;
      });
    });

    try {
      const response = await axios.put(
        `http://localhost:6000/dashboard/notes/${folderId}/${id}`,
        JSON.stringify({ title, content }),
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
  };

  const deleteNote = async (myNote) => {
    const { id, folderId } = myNote;

    setNotesList((prev) => {
      return prev.filter((note) => {
        return note.id !== id;
      });
    });
    setCurrentNote({});
    try {
      const response = await axios.delete(
        `http://localhost:6000/dashboard/notes/${folderId}/${id}`,
        { headers: { token: localStorage.token } }
      );
    } catch (e) {
      console.log(e.response);
    }
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

  const deleteFolder = (id) => {
    if (defaultFolderRef.current.id !== id) {
      setNotesList((prev) => {
        return prev.filter((note) => {
          return note.folderId !== id;
        });
      });
      setFolderList((prev) => {
        return prev.filter((folder) => {
          return folder.id !== id;
        });
      });
      setCurrentFolder(defaultFolderRef.current);
      setCurrentNote({});
    }
  };

  const verifyUser = async () => {
    try {
      if (!localStorage.token) {
        setIsLoggedIn(false);
      } else {
        const response = await axios("http://localhost:6000/auth/verify", {
          headers: { token: localStorage.token },
        });
        console.log(response.data);
        response.data ? setIsLoggedIn(true) : setIsLoggedIn(false);
      }
    } catch (e) {
      console.log(e.response);
    }
  };

  const saveUntrackedNotes = async () => {
    try {
      for (let note of notesList) {
        const { id, title, content, folderId } = note;
        const response = await axios.post(
          `http://localhost:6000/dashboard/notes/${folderId}`,
          JSON.stringify({ noteId: id, title, content }),
          {
            headers: {
              "Content-Type": "application/json",
              token: localStorage.token,
            },
          }
        );
      }
    } catch (e) {
      console.log(e.response);
    }
  };

  const getAllNotesFromDb = async () => {
    try {
      const response = await axios("http://localhost:6000/dashboard/notes", {
        headers: { token: localStorage.token },
      });
      if (response.data[0].note_id) {
        const newList = response.data.map((note) => {
          const { note_id, folder_id, title, content } = note;
          return { id: note_id, folderId: folder_id, title, content };
        });
        setNotesList(newList);
      }
    } catch (e) {
      console.log(e.response);
    }
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

  useEffect(() => {
    verifyUser();
  }, []);

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
        deleteNote,
        isSubmenuOpen,
        setIsSubmenuOpen,
        submenuLocation,
        setSubmenuLocation,
        deleteFolder,
        loginModal,
        setLoginModal,
        signupModal,
        setSignupModal,
        isLoggedIn,
        setIsLoggedIn,
        verifyUser,
        saveUntrackedNotes,
        getAllNotesFromDb,
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
