import React from "react";
import SearchBar from "../components/SearchBar";
import NotesList from "../components/NotesList";
import AddButton from "../components/AddButton";
import { Outlet } from "react-router-dom";
import "./home.scss";
import Modal from "../components/Modal";
import Login from "./Login";
import Signup from "./Signup";

const Home = () => {
  return (
    <main>
      <div className="main-container">
        <SearchBar />
        <NotesList />
        <AddButton />
      </div>
      <Modal />
      <Login />
      <Signup />
      <Outlet />
    </main>
  );
};

export default Home;
