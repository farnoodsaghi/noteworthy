import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useGlobalContext } from "../context";
import { useNavigate } from "react-router-dom";
import "./modal.scss";

const Modal = () => {
  const { setFolderList, isModalVisible, setIsModalVisible } =
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newFolder = { name: input, id: uuidv4() };
    setFolderList((prevVal) => {
      return [...prevVal, newFolder];
    });
    setIsModalVisible(false);
    navigate(`/notes/${newFolder.id}`);
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsModalVisible(false);
    }
  };

  return (
    <div className={`modal-overlay ${isModalVisible && "show-modal"}`}>
      <div className="modal-container" ref={modalRef}>
        <form onSubmit={handleSubmit}>
          <label for="folderName">Folder Name</label>
          <input
            type="text"
            id="folderName"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button>Add</button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
