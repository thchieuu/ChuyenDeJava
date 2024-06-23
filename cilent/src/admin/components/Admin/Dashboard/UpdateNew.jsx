/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState({
    title: "",
    type: "",
    author: "",
    description: "",
    isoTime: "",
    mainText: "",
    imgLinks: [],
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`http://localhost:7000/api/news/${id}`);
        const data = await response.json();
        setNews({
          ...data,
          mainText: data.mainText.join("\n"),
        });
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bài viết:", error);
      }
    };

    fetchNews();
  }, [id]);

  const handleChange = (event) => {
    setNews({
      ...news,
      [event.target.name]: event.target.value,
    });
  };

  const handleImgLinksChange = (index, field, value) => {
    const updatedImgLinks = [...news.imgLinks];
    updatedImgLinks[index][field] = value;
    setNews({ ...news, imgLinks: updatedImgLinks });
  };

  const handleAddImgLink = () => {
    setNews({
      ...news,
      imgLinks: [...news.imgLinks, { url: "", title: "", type: "image" }],
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const updatedNews = {
        ...news,
        mainText: news.mainText.split("\n"),
      };
      const response = await fetch(`http://localhost:7000/api/news/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedNews),
      });

      if (response.ok) {
        navigate("/admin/news-management");
      } else {
        console.error("Lỗi khi cập nhật bài viết:", response.status);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật bài viết:", error);
    }
  };

  const handleDeleteImgLink = (index) => {
    const updatedImgLinks = [...news.imgLinks];
    updatedImgLinks.splice(index, 1);
    setNews({ ...news, imgLinks: updatedImgLinks });
  };

  return (
    <main className="app-content">
      {/* ... */}
      <div className="row">
        <div className="col-md-12">
          <div className="tile">
            <div className="tile-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="title">Tiêu đề:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={news.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="type">Thể loại:</label>
                  <select
                    className="form-control"
                    id="type"
                    name="type"
                    value={news.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="Tin tức">Tin tức</option>
                    <option value="Sự kiện">Sự kiện</option>
                    {/* Thêm các loại bài viết khác */}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="author">Tác giả:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="author"
                    name="author"
                    value={news.author}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Mô tả:</label>
                  <input
                    className="form-control"
                    id="description"
                    name="description"
                    value={news.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="isoTime">Ngày đăng:</label>
                  <p className="form-control-static">
                    {new Date(news.isoTime).toLocaleDateString()}
                  </p>
                </div>
                <div className="form-group">
                  <label htmlFor="mainText">Nội dung chính:</label>
                  <textarea
                    className="form-control"
                    id="mainText"
                    name="mainText"
                    value={news.mainText}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="imgLinks">Hình ảnh/Video:</label>
                  {news.imgLinks.map((link, index) => (
                    <div key={index} className="mb-3 border rounded p-3">
                      <div className="form-group">
                        <label htmlFor={`imgLinks-${index}-url`}>
                          Đường dẫn:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id={`imgLinks-${index}-url`}
                          name="imgLinks"
                          value={link.url}
                          onChange={(event) =>
                            handleImgLinksChange(
                              index,
                              "url",
                              event.target.value
                            )
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`imgLinks-${index}-title`}>
                          Tiêu đề:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id={`imgLinks-${index}-title`}
                          name="imgLinks"
                          value={link.title}
                          onChange={(event) =>
                            handleImgLinksChange(
                              index,
                              "title",
                              event.target.value
                            )
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`imgLinks-${index}-type`}>Loại:</label>
                        <select
                          className="form-control"
                          id={`imgLinks-${index}-type`}
                          name="imgLinks"
                          value={link.type}
                          onChange={(event) =>
                            handleImgLinksChange(
                              index,
                              "type",
                              event.target.value
                            )
                          }
                        >
                          <option value="image">Hình ảnh</option>
                          <option value="video">Video</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteImgLink(index)}
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAddImgLink}
                  >
                    Thêm hình ảnh/video
                  </button>
                </div>
                <button type="submit" className="btn btn-primary">
                  Cập nhật bài viết
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UpdateNews;
