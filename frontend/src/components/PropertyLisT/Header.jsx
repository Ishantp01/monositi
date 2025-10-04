import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo">🔧 BUILD</h1>
        <nav className="nav">
          <a href="#" className="nav-link">Buy</a>
          <a href="#" className="nav-link">Covered Area</a>
          <a href="#" className="nav-link">Flat 1+</a>
          <a href="#" className="nav-link active">BHK</a>
          <a href="#" className="nav-link">More Filters</a>
        </nav>
      </div>
      <div className="header-right">
        <button className="post-property-btn">Post Property</button>
        <img src="https://via.placeholder.com/32" alt="Profile" className="profile-icon" />
      </div>
    </header>
  );
};

export default Header;