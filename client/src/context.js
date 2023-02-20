import { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const AppContext = createContext(null);

const AppProvider = ({ children }) => {
  const defaultFolderRef = useRef({
    id: uuidv4(),
    name: "All Notes",
  });
  const accountDefaultFolder = useRef(null);
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
  const [loading, setLoading] = useState(true);
  const [openEditor, setOpenEditor] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const sidebarRef = useRef(null);
  const [pageDidMount, setPageDidMount] = useState(false);

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

    if (isLoggedIn) {
      try {
        const response = await axios.put(
          `http://localhost:3001/dashboard/notes/${folderId}/${id}`,
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
    if (isLoggedIn) {
      try {
        const response = await axios.delete(
          `http://localhost:3001/dashboard/notes/${folderId}/${id}`,
          { headers: { token: localStorage.token } }
        );
      } catch (e) {
        console.log(e.response);
      }
    }
  };

  const getNoteByFolder = (id) => {
    setNoteByFolderList(() => {
      let list =
        (isLoggedIn && accountDefaultFolder.current === id) ||
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

  const deleteFolder = async (id) => {
    if (
      defaultFolderRef.current.id !== id &&
      accountDefaultFolder.current !== id
    ) {
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
      setCurrentFolder(
        isLoggedIn
          ? { id: accountDefaultFolder.current, name: "All Notes" }
          : defaultFolderRef.current
      );
      setCurrentNote({});
      if (isLoggedIn) {
        try {
          const response = await axios.delete(
            `http://localhost:3001/dashboard/notes/${id}`,
            { headers: { token: localStorage.token } }
          );
        } catch (e) {
          console.log(e.response);
        }
      }
    }
  };

  const verifyUser = async () => {
    try {
      if (!localStorage.token) {
        setIsLoggedIn(false);
      } else {
        const response = await axios("http://localhost:3001/auth/verify", {
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
        const newFolderId =
          folderId === defaultFolderRef.current.id
            ? accountDefaultFolder.current
            : folderId;
        const response = await axios.post(
          `http://localhost:3001/dashboard/notes/${newFolderId}`,
          JSON.stringify({ noteId: id, title, content }),
          {
            headers: {
              "Content-Type": "application/json",
              token: localStorage.token,
            },
          }
        );
      }
      setLoading(false);
    } catch (e) {
      console.log(e.response);
      setLoading(false);
    }
  };

  const saveUntrackedFolders = async () => {
    setLoading(true);
    try {
      for (let folder of folderList) {
        const { id, name } = folder;
        if (
          id !== accountDefaultFolder.current &&
          id !== defaultFolderRef.current.id
        ) {
          const response = await axios.post(
            `http://localhost:3001/dashboard/notes`,
            JSON.stringify({ folderId: id, name }),
            {
              headers: {
                "Content-Type": "application/json",
                token: localStorage.token,
              },
            }
          );
        }
      }
    } catch (e) {
      console.log(e.response);
    }
  };

  const getAllNotesFromDb = async () => {
    try {
      const response = await axios(
        `http://localhost:3001/dashboard/notes/${defaultFolderRef.current.id}`,
        {
          headers: { token: localStorage.token },
        }
      );
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

  const getAllFoldersFromDb = async () => {
    try {
      const response = await axios(`http://localhost:3001/dashboard/notes`, {
        headers: { token: localStorage.token },
      });
      if (response.data[0].folder_id) {
        const newList = response.data.map((folder) => {
          const { folder_id, name } = folder;
          return { id: folder_id, name };
        });
        setFolderList(newList);
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

  useEffect(() => {
    if (isLoggedIn) {
      accountDefaultFolder.current = localStorage.defaultFolder;
      setCurrentFolder({ id: accountDefaultFolder.current, name: "All Notes" });
      saveUntrackedFolders();
      saveUntrackedNotes();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      if (!pageDidMount) {
        setPageDidMount(true);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("defaultFolder");
        setNotesList([]);
        setCurrentNote({});
        setFolderList([defaultFolderRef.current]);
        setCurrentFolder(defaultFolderRef.current);
      }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!loading) {
      getAllFoldersFromDb();
      getAllNotesFromDb();
    }
  }, [loading]);

  useEffect(() => {
    setCurrentNote({});
  }, [currentFolder]);

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
        saveUntrackedFolders,
        getAllFoldersFromDb,
        accountDefaultFolder,
        openEditor,
        setOpenEditor,
        toggleSidebar,
        setToggleSidebar,
        sidebarRef,
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
