// components/NewsCardList.js
import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NewsCard from "./NewsCard";

const defaultImageUrl = "../../tinthethao.png"; // URL hình ảnh mặc định

function NewsCardList(props) {
    const { newsList, showCloseButton } = props;

    return (
        <Container>
            <Row>
                {newsList.map((news) => (
                    <Col xs={12} md={6} lg={4} className="mb-4" key={news._id}>
                        <NewsCard
                            newsId={news._id}
                            imgSrc={news.imgLinks.length > 0 ? news.imgLinks[0].url : defaultImageUrl}
                            title={news.title}
                            description={news.description}
                            hasCloseButton={showCloseButton} // Sử dụng prop này để kiểm soát nút đóng
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default NewsCardList;
