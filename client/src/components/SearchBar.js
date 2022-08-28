import React from "react";
import { useGlobalContext } from "../context";
import { Icon } from "@iconify/react";
import "./search-bar.scss";

const SearchBar = () => {
  const { searchInput, setSearchInput, setToggleSidebar, toggleSidebar } =
    useGlobalContext();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        className="hamburger"
        onClick={() => setToggleSidebar(!toggleSidebar)}
      >
        <Icon icon="quill:hamburger" />
      </div>
      <div className="search-bar">
        <Icon icon="bx:search" className="search-icon" />
        <input
          type="text"
          name="search"
          value={searchInput}
          placeholder="Search Notes"
          onChange={handleChange}
        />
      </div>
    </form>
  );
};

export default SearchBar;
