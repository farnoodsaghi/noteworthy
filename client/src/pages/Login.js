import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import "./login.scss";
import { useGlobalContext } from "../context";

const Login = () => {
  const { loginModal, setLoginModal, setSignupModal, setIsLoggedIn } =
    useGlobalContext();
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const loginRef = useRef(null);

  const { email, password } = inputs;

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:6000/auth/login",
        JSON.stringify({ email, password }),
        {
          headers: {
            "Content-Type": "application/json",
            withCredentials: true,
          },
        }
      );
      localStorage.setItem("token", response.data.token);
      setLoginModal(false);
      setInputs({ name: "", email: "", password: "" });
      setIsLoggedIn(true);
    } catch (e) {
      console.log(e.response);
    }
  };

  const handleClickOutside = (e) => {
    if (loginRef.current && !loginRef.current.contains(e.target)) {
      setLoginModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [loginRef]);

  return (
    <div className={`login-modal-overlay ${loginModal && "show-modal"}`}>
      <div className="login-modal-container" ref={loginRef}>
        <form onSubmit={handleSubmit}>
          <div className="login-form-title">
            <h1>Welcome back</h1>
            <p>Welcome back! Please enter your details.</p>
          </div>
          <div className="login-form-container">
            <input
              type="text"
              name="email"
              className="login-input"
              required
              value={email}
              onChange={handleChange}
            />
            <label htmlFor="email" className="login-label">
              <span className="login-label-text">Email</span>
            </label>
          </div>
          <div className="login-form-container">
            <input
              type="password"
              name="password"
              className="login-input"
              required
              value={password}
              onChange={handleChange}
            />
            <label htmlFor="password" className="login-label">
              <span className="login-label-text">Password</span>
            </label>
          </div>
          <div className="login-form-container">
            <button>Log in</button>
          </div>
          <p
            className="switch-form-btn"
            onClick={() => {
              setLoginModal(false);
              setSignupModal(true);
            }}
          >
            Don't have an account? <strong>Sign up</strong>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
