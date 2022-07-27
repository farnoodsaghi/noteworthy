import React from "react";
import SearchBar from "../components/SearchBar";
import NotesList from "../components/NotesList";
import AddButton from "../components/AddButton";
import { Outlet } from "react-router-dom";
import "./home.scss";

const Home = () => {
  return (
    <main>
      <div className="main-container">
        <SearchBar />
        <NotesList />
        <AddButton />
      </div>
      <Outlet />
    </main>
  );
};

export default Home;
