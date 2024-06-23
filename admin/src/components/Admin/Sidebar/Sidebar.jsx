/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="app-sidebar">
      <div className="app-sidebar__overlay" data-toggle="sidebar"></div>
      <div className="app-sidebar__user">
        <img
          className="app-sidebar__user-avatar"
          src="/images/hay.jpg"
          width="50px"
          alt="User Image"
        />
        <div>
          <p className="app-sidebar__user-name"><b>Admin</b></p>
          <p className="app-sidebar__user-designation">Chào mừng bạn trở lại</p>
        </div>
      </div>
      <hr />
      <ul className="app-menu">
        <li>
          <NavLink className="app-menu__item" activeClassName="active" to="/dashboard">
            <i className="app-menu__icon bx bx-tachometer"></i> 
            <span className="app-menu__label">Bảng điều khiển</span>
          </NavLink>
        </li>
        <li>
          <NavLink className="app-menu__item" activeClassName="active" to="/news-management">
            <i className="app-menu__icon bx bx-id-card"></i>
            <span className="app-menu__label">Quản lý bài viết</span>
          </NavLink>
        </li>
        <li>
          <NavLink className="app-menu__item" activeClassName="active" to="/users-management">
            <i className="app-menu__icon bx bx-id-card"></i>
            <span className="app-menu__label">Quản lý người đọc</span>
          </NavLink>
        </li>
        <li>
          <NavLink className="app-menu__item" activeClassName="active" to="/comments-management">
            <i className="app-menu__icon bx bx-id-card"></i>
            <span className="app-menu__label">Quản lý comment</span>
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
