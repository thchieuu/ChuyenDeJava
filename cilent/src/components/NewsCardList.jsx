import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NewsCard from "./NewsCard";

function NewsCardList({ newsList, showCloseButton = false }) {
    return (
        <Container>
            <Row>
                {newsList.map((news) => (
                    <Col xs={12} md={6} lg={4} className="mb-4" key={news._id}>
                        <NewsCard
                            newsId={news._id}
                            imgSrc={news.imgLinks && news.imgLinks.length > 0 ? news.imgLinks[0].url : null}
                            title={news.title}
                            description={news.description}
                            hasCloseButton={showCloseButton}
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default NewsCardList;
