/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const NewsMgmt = () => {
  const [newsList, setNewsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://localhost:7000/api/news");
        const data = await response.json();
        setNewsList(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bài viết:", error);
      }
    };

    fetchNews();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:7000/api/news/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Xóa thành công
        setNewsList(newsList.filter((news) => news._id !== id));
      } else {
        // Xử lý lỗi
        console.error("Lỗi khi xóa bài viết:", response.status);
      }
    } catch (error) {
      console.error("Lỗi khi xóa bài viết:", error);
    }
  };

  // Tính toán index bắt đầu và kết thúc của trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNewsList = newsList.slice(indexOfFirstItem, indexOfLastItem);

  // Tạo ra các nút phân trang
  const renderPagination = () => {
    const pageNumbers = [];
    const totalPages = Math.ceil(newsList.length / itemsPerPage);
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
                onClick={() => setCurrentPage(number)}
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

  return (
    <main className="app-content">
      <div className="app-title">
        <ul className="app-breadcrumb breadcrumb side">
          <li className="breadcrumb-item active">
            <a href="#">
              <b>Danh sách bài viết</b>
            </a>
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
                  <Link
                    to="/admin/add-news"
                    className="btn btn-add btn-sm"
                    title="Thêm"
                  >
                    <i className="fas fa-plus"></i> Tạo mới bài viết
                  </Link>
                </div>
              </div>
              <table
                className="table table-hover table-bordered js-copytextarea"
                id="sampleTable"
              >
                <thead>
                  <tr>
                    <th width="10">
                      <input type="checkbox" id="all" />
                    </th>
                    <th width="150">Tiêu đề</th>
                    <th width="350">Mô tả</th>
                    <th width="100">Tác giả</th>
                    <th width="200">Thể loại</th>
                    <th width="100">Ngày đăng</th>
                    <th width="100">Lượt xem</th>
                    <th width="100">Tính năng</th>
                  </tr>
                </thead>
                <tbody>
                  {currentNewsList.map((news) => (
                    <tr key={news._id}>
                      <td>
                        <input type="checkbox" name="check1" value="1" />
                      </td>
                      <td>{news.title}</td>
                      <td>{news.description}</td>
                      <td>{news.author}</td>
                      <td>{news.type}</td>
                      <td>{new Date(news.isoTime).toLocaleDateString()}</td>
                      <td>100</td>
                      <td className="table-td-center">
                        <Link
                          to={`/admin/update-news/${news._id}`}
                          className="btn btn-primary btn-sm edit"
                          title="Sửa"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                        <button
                          className="btn btn-primary btn-sm trash"
                          type="button"
                          title="Xóa"
                          onClick={() => handleDelete(news._id)}
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
    </main>
  );
};

export default NewsMgmt;