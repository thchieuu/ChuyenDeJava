/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddNews = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [imageInputs, setImageInputs] = useState([{ type: 'url', url: "", title: "", file: null }]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Cleanup function để giải phóng Object URLs
    return () => {
      imageInputs.forEach(input => {
        if (input.type === 'file' && input.url) {
          URL.revokeObjectURL(input.url);
        }
      });
    };
  }, [imageInputs]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('type', category);
      formData.append('author', author);
      formData.append('description', description);
      formData.append('dateTime', new Date().toLocaleString());
      formData.append('isoTime', new Date().toISOString());
      formData.append('mainText', JSON.stringify(content.split("\n")));

      const imgLinksPromises = imageInputs.map(async (input, index) => {
        if (input.type === 'file' && input.file) {
          const fileName = `image_${index}_${input.file.name}`;
          formData.append('images', input.file, fileName);
          return { url: fileName, title: input.title, type: "image" };
        } else {
          return { url: input.url, title: input.title, type: "image" };
        }
      });

      const imgLinks = await Promise.all(imgLinksPromises);
      formData.append('imgLinks', JSON.stringify(imgLinks));

      const response = await fetch("http://localhost:7000/api/news", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Lỗi khi tạo bài viết");
      }

      const data = await response.json();
      console.log("Bài viết đã được tạo thành công:", data);
      navigate("/admin/news-management");
    } catch (error) {
      console.error("Lỗi khi tạo bài viết:", error);
    }
  };

  const handleImageChange = (e, index) => {
    const newUrl = e.target.value;
    setImageInputs((prevInputs) => {
      const updatedInputs = [...prevInputs];
      updatedInputs[index] = { ...updatedInputs[index], type: 'url', url: newUrl, file: null };
      return updatedInputs;
    });
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      setImageInputs((prevInputs) => {
        const updatedInputs = [...prevInputs];
        if (updatedInputs[index].type === 'file' && updatedInputs[index].url) {
          URL.revokeObjectURL(updatedInputs[index].url);
        }
        updatedInputs[index] = { 
          ...updatedInputs[index], 
          type: 'file', 
          file: file, 
          url: URL.createObjectURL(file) 
        };
        return updatedInputs;
      });
    }
  };

  const handleTitleChange = (e, index) => {
    const newTitle = e.target.value;
    setImageInputs((prevInputs) => {
      const updatedInputs = [...prevInputs];
      updatedInputs[index].title = newTitle;
      return updatedInputs;
    });
  };

  const handleAddImage = () => {
    setImageInputs((prevInputs) => [...prevInputs, { type: 'url', url: "", title: "", file: null }]);
  };

  const handleRemoveImage = (index) => {
    setImageInputs((prevInputs) => {
      const removedInput = prevInputs[index];
      if (removedInput.type === 'file' && removedInput.url) {
        URL.revokeObjectURL(removedInput.url);
      }
      return prevInputs.filter((_, i) => i !== index);
    });
  };

  return (
    <main className="app-content">
      <div className="app-title">
        <ul className="app-breadcrumb breadcrumb">
          <li className="breadcrumb-item">Danh sách bài viết</li>
          <li className="breadcrumb-item">
            <a href="#">Thêm bài viết</a>
          </li>
        </ul>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="tile">
            <h3 className="tile-title">Tạo mới bài viết</h3>
            <div className="tile-body">
              <div className="row element-button">
                <div className="col-sm-2">
                  <button
                    type="button"
                    className="btn btn-add btn-sm"
                    data-toggle="modal"
                    data-target="#exampleModalCenter"
                  >
                    <b>
                      <i className="fas fa-folder-plus"></i> Tạo thể loại mới
                    </b>
                  </button>
                </div>
              </div>
              <form className="row" onSubmit={handleSubmit}>
                <div className="form-group col-md-4">
                  <label className="control-label">Tiêu đề</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="form-group col-md-4">
                  <label className="control-label">Tác giả</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </div>
                <div className="form-group col-md-4">
                  <label className="control-label">Thể loại</label>
                  <select
                    className="form-control"
                    id="exampleSelect2"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">-- Chọn thể loại --</option>
                    <option value="Tin tức">Tin tức</option>
                    <option value="Bóng đá">Bóng đá</option>
                    <option value="Cầu lông">Cầu lông</option>
                  </select>
                </div>
                <div className="form-group col-md-12">
                  <label className="control-label">Mô tả</label>
                  <input
                    className="form-control"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></input>
                </div>
                <div className="form-group col-md-12">
                  <label className="control-label">Nội dung</label>
                  <textarea
                    className="form-control"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  ></textarea>
                </div>
                <div className="form-group col-md-12">
                  <label htmlFor="images" className="control-label">
                    Hình ảnh
                  </label>
                  <div className="row">
                    {imageInputs.map((input, index) => (
                      <div key={index} className="col-md-4 mb-3">
                        <div className="image-input-container">
                          <img
                            src={input.url}
                            className="image-preview"
                            alt={`Xem trước ${index}`}
                            style={{ maxWidth: "200px", maxHeight: "150px" }}
                          />
                          <div className="image-input-overlay">
                            <input
                              type="text"
                              className="form-control image-title-input"
                              placeholder="Tiêu đề ảnh"
                              value={input.title}
                              onChange={(e) => handleTitleChange(e, index)}
                            />
                            <select 
                              className="form-control"
                              value={input.type}
                              onChange={(e) => {
                                setImageInputs(prev => {
                                  const updated = [...prev];
                                  if (updated[index].type === 'file' && updated[index].url) {
                                    URL.revokeObjectURL(updated[index].url);
                                  }
                                  updated[index] = { ...updated[index], type: e.target.value, url: "", file: null };
                                  return updated;
                                });
                              }}
                            >
                              <option value="url">Nhập URL</option>
                              <option value="file">Tải lên file</option>
                            </select>
                            {input.type === 'url' ? (
                              <input
                                type="text"
                                className="form-control image-url-input"
                                placeholder="Nhập đường dẫn ảnh"
                                value={input.url}
                                onChange={(e) => handleImageChange(e, index)}
                              />
                            ) : (
                              <input
                                type="file"
                                className="form-control"
                                onChange={(e) => handleFileChange(e, index)}
                                accept="image/*"
                              />
                            )}
                            <div className="image-action-buttons">
                              <button
                                type="button"
                                className="btn btn-danger btn-sm ml-2"
                                onClick={() => handleRemoveImage(index)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="col-md-4 mb-3">
                      <button
                        type="button"
                        className="btn btn-secondary btn-block add-image-button"
                        onClick={handleAddImage}
                      >
                        <i className="fas fa-plus"></i> Thêm ảnh
                      </button>
                    </div>
                  </div>
                </div>
                <div className="form-group d-flex justify-content-end mt-3">
                  <button className="btn btn-save mr-2" type="submit" style={{ backgroundColor: "rgb(252 203 4)" }}>
                    Lưu lại
                  </button>
                  <a className="btn btn-cancel" href="/admin/news-management" style={{ backgroundColor: "rgb(252 203 4)" }}>
                    Hủy bỏ
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AddNews;