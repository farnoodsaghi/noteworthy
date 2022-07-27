import React from "react";
import SearchBar from "../components/SearchBar";
import NotesList from "../components/NotesList";
import AddButton from "../components/AddButton";
import { Outlet } from "react-router-dom";
import "./home.scss";
import Modal from "../components/Modal";

const Home = () => {
  return (
    <main>
      <div className="main-container">
        <SearchBar />
        <NotesList />
        <AddButton />
      </div>
      <Modal />
      <Outlet />
    </main>
  );
};

export default Home;
