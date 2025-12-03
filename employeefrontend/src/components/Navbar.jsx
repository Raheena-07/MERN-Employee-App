import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="app-name">Employee App</div>
      <div className="nav-links">
        {user && <Link to="/employees" className="button">Employees</Link>}
        <Link to="/register" className="button">Register</Link>
        {user ? (
          <button className="button" onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login" className="button">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
