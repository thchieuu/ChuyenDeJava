import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import styles from "./NewsDetails.module.css";
import "./NewsDetails.css";
import { FavoritesContext } from "../store/favorites/context";

const defaultImageUrl = "../../a7.jpg"; // URL hình ảnh mặc định

function NewsDetails() {
  const { newsId } = useParams();
  const { state, dispatch } = useContext(FavoritesContext);

  const [news, setNews] = useState(null);
  const [isAlertDisplayed, setIsAlertDisplayed] = useState(false);

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/news/${newsId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch news data");
        }
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error("Error fetching news data:", error);
      }
    };

    fetchNewsData();
  }, [newsId]);

  const handleAddToFavorites = () => {
    dispatch({ type: "ADD_TO_FAVORITES", payload: news });
    setIsAlertDisplayed(true);
    setTimeout(() => setIsAlertDisplayed(false), 3000);
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
              <Button onClick={handleAddToFavorites} className="mt-4">Thêm vào mục ƯA THÍCH</Button>
            </Col>
          </Row>
        </Container>
      </Layout>
  );
}

export default NewsDetails;
