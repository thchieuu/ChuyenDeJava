/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [time, setTime] = useState("");
  const [latestNews, setLatestNews] = useState([]);

  useEffect(() => {
    const updateClock = () => {
      const today = new Date();
      const weekday = [
        "Chủ Nhật",
        "Thứ Hai",
        "Thứ Ba",
        "Thứ Tư",
        "Thứ Năm",
        "Thứ Sáu",
        "Thứ Bảy",
      ];
      const day = weekday[today.getDay()];
      const dd = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
      const mm =
        today.getMonth() + 1 < 10
          ? "0" + (today.getMonth() + 1)
          : today.getMonth() + 1;
      const yyyy = today.getFullYear();
      const h = today.getHours();
      const m =
        today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
      const s =
        today.getSeconds() < 10 ? "0" + today.getSeconds() : today.getSeconds();
      setTime(`${day}, ${dd}/${mm}/${yyyy} - ${h} giờ ${m} phút ${s} giây`);
    };

    const fetchLatestNews = async () => {
      try {
        const response = await fetch("http://localhost:7000/api/news");
        const data = await response.json();

        // Sắp xếp dữ liệu theo thời gian giảm dần (mới nhất lên đầu)
        data.sort((a, b) => new Date(b.isoTime) - new Date(a.isoTime));

        // Giới hạn số lượng bài viết muốn hiển thị (ví dụ: 5)
        setLatestNews(data.slice(0, 5));
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bài viết:", error);
      }
    };

    const timerId = setInterval(updateClock, 1000);
    fetchLatestNews();
    return () => clearInterval(timerId);
  }, []);

  return (
    <main className="app-content">
      <div className="row">
        <div className="col-md-12">
          <div className="app-title">
            <ul className="app-breadcrumb breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">
                  <b>Bảng điều khiển</b>
                </a>
              </li>
            </ul>
            <div id="clock">{time}</div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-3">
              <div className="widget-small primary coloured-icon">
                <i className="icon bx bx-edit fa-3x"></i>
                <div className="info">
                  <h4>Tổng bài viết</h4>
                  <p>
                    <b>56 bài viết</b>
                  </p>
                  <p className="info-tong">Tổng số bài viết được quản lý.</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="widget-small info coloured-icon">
                <i className="icon bx bx-category fa-3x"></i>
                <div className="info">
                  <h4>Tổng thể loại</h4>
                  <p>
                    <b>1850 thể loại</b>
                  </p>
                  <p className="info-tong">Tổng số thể loại được quản lý.</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="widget-small warning coloured-icon">
                <i className="icon bx bx-show fa-3x"></i>
                <div className="info">
                  <h4>Tổng lượt xem</h4>
                  <p>
                    <b>247 lượt xem</b>
                  </p>
                  <p className="info-tong">
                    Tổng số lượt xem bài viết trong tháng.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="widget-small danger coloured-icon">
                <i className="icon bx bx-hourglass fa-3x"></i>
                <div className="info">
                  <h4>Bài viết chờ duyệt</h4>
                  <p>
                    <b>4 bài viết</b>
                  </p>
                  <p className="info-tong">Số bài viết cần duyệt.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="tile">
                <h3 className="tile-title">Bài viết mới nhất</h3>
                <div>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th width="200">Tiêu đề</th>
                        <th>Mô tả</th>
                        <th width="200">Thể loại</th>
                        <th width="150">Tác giả</th>
                        <th width="150">Ngày đăng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {latestNews.map((news) => (
                        <tr key={news._id}>
                          <td>{news.title}</td>
                          <td>{news.description}</td>
                          <td>{news.type}</td>
                          <td>{news.author}</td>
                          <td>{new Date(news.isoTime).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
