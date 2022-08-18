import React, { useRef, useEffect } from "react";
import "./signup.scss";
import { useGlobalContext } from "../context";

const Signup = () => {
  const { setLoginModal, signupModal, setSignupModal } = useGlobalContext();
  const signupRef = useRef(null);

  const handleClickOutside = (e) => {
    if (signupRef.current && !signupRef.current.contains(e.target)) {
      setSignupModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [signupRef]);

  return (
    <div className={`signup-modal-overlay ${signupModal && "show-modal"}`}>
      <div className="signup-modal-container" ref={signupRef}>
        <form>
          <div className="signup-form-title">
            <h1>Hello there</h1>
            <p>Welcome! Create an account in just a few clicks.</p>
          </div>
          <div className="signup-form-container">
            <input type="text" name="name" className="signup-input" required />
            <label htmlFor="name" className="signup-label">
              <span className="signup-label-text">Name</span>
            </label>
          </div>
          <div className="signup-form-container">
            <input type="text" name="email" className="signup-input" required />
            <label htmlFor="email" className="signup-label">
              <span className="signup-label-text">Email</span>
            </label>
          </div>
          <div className="signup-form-container">
            <input
              type="password"
              name="password"
              className="signup-input"
              required
            />
            <label htmlFor="password" className="signup-label">
              <span className="signup-label-text">Password</span>
            </label>
          </div>
          <div className="signup-form-container">
            <button>Sign up</button>
          </div>
          <p
            className="switch-form-btn"
            onClick={() => {
              setSignupModal(false);
              setLoginModal(true);
            }}
          >
            Already have an account? <strong>Log in</strong>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
