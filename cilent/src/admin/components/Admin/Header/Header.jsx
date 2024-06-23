/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { useNavigate } from 'react-router-dom';
const Header = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <header 
      className="app-header" 
      style={{ height: '50px', display: 'flex', alignItems: 'center', padding: '0' }}
    >
      <a 
        className="app-sidebar__toggle" 
        href="#" 
        data-toggle="sidebar" 
        aria-label="Hide Sidebar" 
        style={{ display: 'flex', alignItems: 'center', padding: '0 10px' }}
      ></a>
      <ul 
        className="app-nav" 
        style={{ height: '50px', margin: '0', padding: '0', listStyle: 'none', display: 'flex', alignItems: 'center' }}
      >
        <li>
          <a 
            className="app-nav__item" 
            href="#" 
            onClick={handleLogout}
            style={{ margin: '0', display: 'flex', alignItems: 'center', height: '100%' }}
          >
            <i className="bx bx-log-out bx-rotate-180"></i>
          </a>
        </li>
      </ul>
    </header>
  );
};

export default Header;
