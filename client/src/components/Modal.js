import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useGlobalContext } from "../context";
import { useNavigate } from "react-router-dom";
import "./modal.scss";

const Modal = () => {
  const { setFolderList, isModalVisible, setIsModalVisible, isLoggedIn } =
    useGlobalContext();
  const [input, setInput] = useState("");
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newFolder = { name: input, id: uuidv4() };
    setFolderList((prevVal) => {
      return [...prevVal, newFolder];
    });
    setIsModalVisible(false);
    setInput("");
    navigate(`/notes/${newFolder.id}`);

    if (isLoggedIn) {
      const { id, name } = newFolder;
      try {
        const response = await axios.post(
          `http://localhost:6000/dashboard/notes`,
          JSON.stringify({ folderId: id, name }),
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

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsModalVisible(false);
    }
  };

  return (
    <div className={`modal-overlay ${isModalVisible && "show-modal"}`}>
      <div className="modal-container" ref={modalRef}>
        <h3>Create a new folder</h3>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter a folder name"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button>Create</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
