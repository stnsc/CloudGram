import React from 'react';
import { Link } from 'react-router-dom';
import '../stylesheets/Navbar.css'; // We will add simple styles below

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">CloudGram</div>
      <div className="links">
        {/* 'Link' prevents full page reloads, maintaining the "AJAX" feel  */}
        <Link to="/" className="nav-link">Global Feed</Link>
        <Link to="/upload" className="nav-link">Upload Photo</Link>
      </div>
    </nav>
  );
};

export default Navbar;