import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import "./signup.scss";
import { useGlobalContext } from "../context";

const Signup = () => {
  const { setLoginModal, signupModal, setSignupModal, setIsLoggedIn } =
    useGlobalContext();
  const signupRef = useRef(null);
  const [inputs, setInputs] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState([]);

  const { name, email, password } = inputs;

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleClickOutside = (e) => {
    if (signupRef.current && !signupRef.current.contains(e.target)) {
      setSignupModal(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/auth/register",
        JSON.stringify({ username: name, email, password }),
        {
          headers: {
            "Content-Type": "application/json",
            withCredentials: true,
          },
        }
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("defaultFolder", response.data.defaultFolder);
      setSignupModal(false);
      setInputs({ name: "", email: "", password: "" });
      setIsLoggedIn(true);
    } catch (e) {
      console.log(e.response);
      if (
        e.response.data.hasOwnProperty("errors") &&
        e.response.data.errors.length > 0
      ) {
        setError(e.response.data.errors);
      }
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
        <form onSubmit={handleSubmit}>
          <div className="signup-form-title">
            <h1>Hello there</h1>
            <p>Welcome! Create an account in just a few clicks.</p>
          </div>
          <div className="signup-form-container">
            <input
              type="text"
              name="name"
              className="signup-input"
              required
              value={name}
              onChange={handleChange}
            />
            <label htmlFor="name" className="signup-label">
              <span className="signup-label-text">Name</span>
            </label>
          </div>
          <div className="signup-form-container">
            <input
              type="text"
              name="email"
              className="signup-input"
              required
              value={email}
              onChange={handleChange}
            />
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
              value={password}
              onChange={handleChange}
            />
            <label htmlFor="password" className="signup-label">
              <span className="signup-label-text">Password</span>
            </label>
          </div>
          {error.length > 0 && (
            <div className="signup-form-container error">
              <p>{error[0].msg}</p>
            </div>
          )}
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
