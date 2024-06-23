/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";

const CommentsMgmt = () => {
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsPerPage] = useState(10); 
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch("http://localhost:7000/api/comments");
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu bài viết:", error);
    }
  };

  // Hàm tính toán index bắt đầu và kết thúc của trang hiện tại
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);

  // Hàm xử lý khi click vào nút phân trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Hàm tạo ra các nút phân trang
  const renderPagination = () => {
    const pageNumbers = [];
    const totalPages = Math.ceil(comments.length / commentsPerPage);
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

  const deleteComment = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
      try {
        const response = await fetch(
          `http://localhost:7000/api/comments/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setComments(comments.filter((comment) => comment._id !== id));
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  return (
    <main className="app-content">
      <div className="app-title">
        <ul className="app-breadcrumb breadcrumb side">
          <li className="breadcrumb-item active">
            <a href="#">
              <b>Danh sách bình luận</b>
            </a>
          </li>
        </ul>
        <div id="clock"></div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="tile">
            <div className="tile-body">
              <table className="table table-hover table-bordered js-copytextarea" id="sampleTable">
                <thead>
                  <tr>
                    <th width="10">
                      <input type="checkbox" id="all" />
                    </th>
                    <th>Bài viết</th>
                    <th>Người bình luận</th>
                    <th>Nội dung</th>
                    <th>Số lượt thích</th>
                    <th>Ngày đăng</th>
                    <th width="100">Tính năng</th>
                  </tr>
                </thead>
                <tbody>
                  {currentComments.map((comment) => (
                    <tr key={comment._id}>
                      <td>
                        <input type="checkbox" id="check1" />
                      </td>
                      <td>{comment.news.title}</td>
                      <td>{comment.author.username}</td>
                      <td>{comment.content}</td>
                      <td>{comment.likes.length}</td>
                      <td>{new Date(comment.createdAt).toLocaleDateString()}</td>
                      <td className="table-td-center">
                        <button
                          className="btn btn-primary btn-sm trash"
                          type="button"
                          title="Xóa"
                          onClick={() => deleteComment(comment._id)}
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

export default CommentsMgmt;