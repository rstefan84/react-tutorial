import React from 'react';
import { NavLink } from 'react-router-dom';

function Header() {
  const activeStyle = { color: '#F15B2A' };
  return (
    <nav>
      <NavLink to="/" style={({ isActive }) => isActive ? activeStyle : undefined}>
        Home
      </NavLink>
      {" | "}
      <NavLink to="/mainlist" style={({ isActive }) => isActive ? activeStyle : undefined}>
        Main List
      </NavLink>
      {" | "}
      <NavLink to="/servicelist" style={({ isActive }) => isActive ? activeStyle : undefined}>
        Service List
      </NavLink>
      {" | "}
      <NavLink to="/reduxlist" style={({ isActive }) => isActive ? activeStyle : undefined}>
        Redux List
      </NavLink>
      {" | "}
      <NavLink to="/longlist" style={({ isActive }) => isActive ? activeStyle : undefined}>
        Long List
      </NavLink>
      {" | "}
      <NavLink to="/about" style={({ isActive }) => isActive ? activeStyle : undefined}>
        About
      </NavLink>
    </nav>
  );
}

export default Header;