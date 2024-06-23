/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
const Header = () => {
  return (
    <header className="app-header">
      <a className="app-sidebar__toggle" href="#" data-toggle="sidebar" aria-label="Hide Sidebar"></a>
      <ul className="app-nav">
        <li>
          <a className="app-nav__item" href="#">
            <i className="bx bx-log-out bx-rotate-180"></i>
          </a>
        </li>
      </ul>
    </header>
  );
};

export default Header;
