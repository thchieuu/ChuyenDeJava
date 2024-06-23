/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useRef, useState, useEffect } from 'react';

function UsersMgmt() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newUserData, setNewUserData] = useState({
    username: '',
    email: '',
    role: 'user',
    password: '',
  });

  const editModalRef = useRef(null);
  const addModalRef = useRef(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); 
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users', {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };

    fetchUsers();
  }, [token]);

  // Hàm tính toán index bắt đầu và kết thúc của trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  // Hàm xử lý khi click vào nút phân trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Hàm tạo ra các nút phân trang
  const renderPagination = () => {
    const pageNumbers = [];
    const totalPages = Math.ceil(users.length / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <nav>
        <ul className="pagination">
          {pageNumbers.map((number) => (
            <li
              key={number}
              className={`page-item ${currentPage === number ? "active" : ""}`}
            >
              <a
                className="page-link"
                onClick={() => paginate(number)}
                href="#"
              >
                {number}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(editingUser),
      });

      if (response.ok) {
        setUsers(
          users.map((user) =>
            user._id === editingUser._id ? editingUser : user
          )
        );
        setEditingUser(null);
        setShowEditModal(false);
      } else {
        console.error('Lỗi khi cập nhật người dùng');
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu cập nhật:', error);
    }
  };

  const handleInputChange = (event) => {
    setEditingUser({
      ...editingUser,
      [event.target.name]: event.target.value,
    });
  };

  const handleNewInputChange = (event) => {
    setNewUserData({
      ...newUserData,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddNewUser = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newUserData),
      });

      if (response.ok) {
        const responseNewUser = await fetch('http://localhost:5000/api/users/');
        const newUser = await responseNewUser.json();
        setUsers(newUser);
        setNewUserData({ username: '', email: '', role: 'user', password: '' });
        setShowAddModal(false);
      } else {
        console.error('Lỗi khi thêm người dùng');
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu thêm người dùng:', error);
    }
  };

  const handleDeleteClick = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            "Authorization": `Bearer ${token}`
          },
        });

        if (response.ok) {
          setUsers(users.filter((user) => user._id !== userId));
        } else {
          console.error('Lỗi khi xóa người dùng');
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu xóa:', error);
      }
    }
  };

  useEffect(() => {
    if (showEditModal) {
      editModalRef.current.style.display = 'block';
    } else {
      editModalRef.current.style.display = 'none';
    }
  }, [showEditModal]);

  useEffect(() => {
    if (showAddModal) {
      addModalRef.current.style.display = 'block';
    } else {
      addModalRef.current.style.display = 'none';
    }
  }, [showAddModal]);

  return (
    <main className="app-content">
      <div className="app-title">
        <ul className="app-breadcrumb breadcrumb side">
          <li className="breadcrumb-item active">
            <a href="#"><b>Danh sách người dùng</b></a>
          </li>
        </ul>
        <div id="clock"></div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="tile">
            <div className="tile-body">
              <div className="row element-button">
                <div className="col-sm-2">
                  <button 
                    type="button" 
                    className="btn btn-add btn-sm" 
                    onClick={() => setShowAddModal(true)}
                  >
                    <i className="fas fa-plus"></i> Thêm người dùng
                  </button>
                </div>
              </div>
              <table className="table table-hover table-bordered js-copytextarea" id="sampleTable">
                <thead>
                  <tr>
                    <th width="10"><input type="checkbox" id="all" /></th>
                    <th>Họ và tên</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Trạng thái</th>
                    <th width="100">Tính năng</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr key={user._id}>
                      <td><input type="checkbox" name="check1" value="1" /></td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.isDeleted ? 'Đã xóa' : 'Hoạt động'}</td>
                      <td className="table-td-center">
                        <button 
                          className="btn btn-primary btn-sm edit" 
                          type="button" 
                          title="Sửa" 
                          onClick={() => handleEditClick(user)}
                          disabled={user.isDeleted} 
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-danger btn-sm trash"
                          type="button"
                          title="Xóa"
                          onClick={() => handleDeleteClick(user._id)}
                          disabled={user.isDeleted}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {renderPagination()} {/* Hiển thị phân trang */}
            </div>
          </div>
        </div>
      </div>

      <div ref={editModalRef} className="modal" id="ModalUP">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <div className="row">
                <div className="form-group col-md-12">
                  <span className="thong-tin-thanh-toan">
                    <h5>Chỉnh sửa thông tin người dùng</h5>
                  </span>
                </div>
              </div>
              {editingUser && (
                <div className="row">
                  <div className="form-group col-md-6">
                    <label className="control-label">Username</label>
                    <input 
                      className="form-control" 
                      type="text" 
                      name="username"  
                      defaultValue={editingUser.username} 
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label className="control-label">Email</label>
                    <input 
                      className="form-control" 
                      type="email" 
                      name="email" 
                      defaultValue={editingUser.email} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label className="control-label">Vai trò</label>
                    <select 
                      className="form-control" 
                      name="role" 
                      value={editingUser.role} 
                      onChange={handleInputChange} 
                    >
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </select>
                  </div>
                  <div className="form-group col-md-6">
                    <label className="control-label">Trạng thái</label>
                    <input 
                      type="text"
                      className="form-control"
                      value={editingUser.isDeleted ? 'Đã xóa' : 'Hoạt động'}
                      readOnly 
                    />
                  </div>
                </div>
              )}
              <br />
              <button className="btn btn-save" type="button" onClick={handleSaveEdit}>Lưu lại</button>
              <button className="btn btn-cancel" type="button" onClick={() => setShowEditModal(false)}>Hủy bỏ</button>
              <br />
            </div>
            <div className="modal-footer"></div>
          </div>
        </div>
      </div>

      <div ref={addModalRef} className="modal" id="ModalAdd">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <div className="row">
                <div className="form-group col-md-12">
                  <span className="thong-tin-thanh-toan">
                    <h5>Thêm người dùng mới</h5>
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="form-group col-md-6">
                  <label className="control-label">Tên người dùng</label>
                  <input
                    className="form-control"
                    type="text"
                    name="username"
                    value={newUserData.username}
                    onChange={handleNewInputChange}
                    required
                  />
                </div>
                <div className="form-group col-md-6">
                  <label className="control-label">Email</label>
                  <input
                    className="form-control"
                    type="email"
                    name="email"
                    value={newUserData.email}
                    onChange={handleNewInputChange}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group col-md-6">
                  <label className="control-label">Mật khẩu</label>
                  <input 
                    className="form-control" 
                    type="password" 
                    name="password" 
                    value={newUserData.password} 
                    onChange={handleNewInputChange} 
                    required 
                  />
                </div>
                <div className="form-group col-md-6">
                  <label className="control-label">Vai trò</label>
                  <select
                    className="form-control"
                    name="role"
                    value={newUserData.role}
                    onChange={handleNewInputChange}
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
              </div>
              <br />
              <button
                className="btn btn-save"
                type="button"
                onClick={handleAddNewUser}
              >Thêm mới</button>
              <button className="btn btn-cancel" type="button" onClick={() => setShowAddModal(false)}>Hủy bỏ</button>
              <br />
            </div>
            <div className="modal-footer"></div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default UsersMgmt;