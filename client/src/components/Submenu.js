import React, { useRef, useEffect } from "react";
import { useGlobalContext } from "../context";
import { Icon } from "@iconify/react";
import "./submenu.scss";

const Submenu = () => {
  const {
    setIsModalVisible,
    isSubmenuOpen,
    submenuLocation,
    setIsSubmenuOpen,
    deleteFolder,
    currentFolder,
    setIsLoggedIn,
    isLoggedIn,
    setLoginModal,
  } = useGlobalContext();
  const submenuRef = useRef(null, "submenu");

  useEffect(() => {
    const { left, top } = submenuLocation;
    submenuRef.current.style.left = `${left}px`;
    submenuRef.current.style.top = `${top}px`;
  }, [submenuLocation]);

  const handleClickOutside = (e) => {
    if (submenuRef.current && !submenuRef.current.contains(e.target)) {
      setIsSubmenuOpen(false);
    }
  };

  const handleCreateFolder = () => {
    setIsModalVisible(true);
    setIsSubmenuOpen(false);
  };

  const handleDeleteFolder = () => {
    deleteFolder(currentFolder.id);
    setIsSubmenuOpen(false);
  };

  const handleLogOut = () => {
    setIsLoggedIn(false);
    setIsSubmenuOpen(false);
    window.location.reload();
  };

  const handleLogIn = () => {
    setLoginModal(true);
    setIsSubmenuOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [submenuRef]);

  return (
    <aside className={`submenu ${isSubmenuOpen && "active"}`} ref={submenuRef}>
      <div className="submenu-link-container" onClick={handleCreateFolder}>
        <a>
          <span className="submenu-icon">
            <Icon icon="heroicons-outline:folder-add" />
          </span>
          <p>Create new folder</p>
        </a>
      </div>
      <div className="submenu-link-container" onClick={handleDeleteFolder}>
        <a>
          <span className="submenu-icon">
            <Icon icon="heroicons-outline:folder-remove" />
          </span>
          <p>Delete this folder</p>
        </a>
      </div>
      <hr />
      <div
        className={`submenu-link-container ${isLoggedIn && "logged-in"}`}
        onClick={isLoggedIn ? handleLogOut : handleLogIn}
      >
        <a>
          <span className="submenu-icon">
            {isLoggedIn ? (
              <Icon icon="heroicons-outline:logout" />
            ) : (
              <Icon icon="heroicons-outline:login" />
            )}
          </span>
          <p>{isLoggedIn ? "Sign out" : "Log in"}</p>
        </a>
      </div>
    </aside>
  );
};

export default Submenu;
