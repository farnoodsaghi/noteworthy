import React, { useRef, useEffect } from "react";
import "./login.scss";
import { useGlobalContext } from "../context";

const Login = () => {
  const { loginModal, setLoginModal, setSignupModal } = useGlobalContext();

  const loginRef = useRef(null);

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
        <form>
          <div className="login-form-title">
            <h1>Welcome back</h1>
            <p>Welcome back! Please enter your details.</p>
          </div>
          <div className="login-form-container">
            <input type="text" name="email" className="login-input" required />
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
