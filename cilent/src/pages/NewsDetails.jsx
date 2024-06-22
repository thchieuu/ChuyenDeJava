import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-bootstrap";
import styles from "./NewsDetails.module.css";
import "./NewsDetails.css";
import { FavoritesContext } from "../store/favorites/context";

const defaultImageUrl = "../../a7.jpg"; // URL hình ảnh mặc định

function NewsDetails() {
  const { newsId } = useParams();
  const { state, dispatch } = useContext(FavoritesContext);

  const [news, setNews] = useState(null);
  const [isAlertDisplayed, setIsAlertDisplayed] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const openCommentModal = () => setShowCommentModal(true);
  const closeCommentModal = () => setShowCommentModal(false);

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const response = await fetch(`http://localhost:7000/api/news/${newsId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch news data");
        }
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error("Error fetching news data:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:7000/api/comments/${newsId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchNewsData();
    fetchComments();
  }, [newsId]);

  const handleAddToFavorites = () => {
    dispatch({ type: "ADD_TO_FAVORITES", payload: news });
    setIsAlertDisplayed(true);
    setTimeout(() => setIsAlertDisplayed(false), 3000);
  };

  const handleSubmitComment = async () => {
    try {
      const response = await fetch("http://localhost:7000/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Đảm bảo bạn đã lưu token sau khi đăng nhập
        },
        body: JSON.stringify({ content: comment, newsId }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit comment");
      }

      const newComment = await response.json();
      setComments((prevComments) => [...prevComments, newComment]);
      setComment("");
      closeCommentModal();
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  if (!news) {
    return <p>Loading...</p>;
  }

  const { title, author, formattedDate, mainText, imgLinks } = news;

  return (
      <Layout>
        {isAlertDisplayed && (
            <Alert variant="success" id={styles.alert}>
              Tin tức đã được lưu vào mục ƯA THÍCH
            </Alert>
        )}
        <Container className="NewsDetails my-5">
          <Row className="justify-content-center">
            <Col md={10}>
              <h1 className="pt-3 mb-4">{title}</h1>
              <p className="text-muted mb-3">{author} </p>
              <p className="text-muted mb-5">{formattedDate}</p>
              {imgLinks && imgLinks.length > 0 && (
                  <div className="mb-5">
                    <img src={imgLinks[0].url} alt={imgLinks[0].title} className="img-fluid mb-3" />
                  </div>
              )}
              {mainText.map((paragraph, index) => (
                  <React.Fragment key={index}>
                    <p className="mb-3">{paragraph}</p>
                    {index === 1 && imgLinks && imgLinks.length > 1 && (
                        <div className="mb-5">
                          <img src={imgLinks[1].url} alt={imgLinks[1].title} className="img-fluid mb-3" />
                        </div>
                    )}
                  </React.Fragment>
              ))}
              <Button onClick={openCommentModal} className="mt-4">Bình luận</Button>
              <Button onClick={handleAddToFavorites} className="mt-4">Thêm vào mục ƯA THÍCH</Button>
              <div className="comments-section mt-5">
                <h3>Bình luận</h3>
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <div key={index} className="comment mb-3">
                          <small className="text-muted">{comment.author.username} - {new Date(comment.createdAt).toLocaleString()}</small>
                          <p>{comment.content}</p>

                        </div>
                    ))
                ) : (
                    <p>Chưa có bình luận nào.</p>
                )}
              </div>
            </Col>
          </Row>
        </Container>
        <Modal show={showCommentModal} onHide={closeCommentModal}>
          <Modal.Header closeButton>
            <Modal.Title>Bình luận của bạn</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="commentForm.ControlTextarea">
                <Form.Label>Nhập bình luận của bạn</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeCommentModal}>
              Đóng
            </Button>
            <Button variant="primary" onClick={handleSubmitComment}>
              Gửi bình luận
            </Button>
          </Modal.Footer>
        </Modal>
      </Layout>
  );
}

export default NewsDetails;
