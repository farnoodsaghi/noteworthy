import React from "react";
import "./signup-prompt.scss";
import { useGlobalContext } from "../context";

const SignupPrompt = () => {
  const { setLoginModal } = useGlobalContext();
  return (
    <section className="signup-prompt" onClick={() => setLoginModal(true)}>
      <p>
        Your notes are not being saved! Please <strong>sign up</strong> or{" "}
        <strong>login</strong> to save your notes.
      </p>
    </section>
  );
};

export default SignupPrompt;
