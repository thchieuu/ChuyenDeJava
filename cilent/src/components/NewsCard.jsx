// components/NewsCard.js
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "./NewsCard.css";
import { FavoritesContext } from "../store/favorites/context";

const defaultImageUrl = "https://via.placeholder.com/100"; // URL hình ảnh mặc định

function NewsCard(props) {
    const { dispatch } = useContext(FavoritesContext);
    const { newsId, imgSrc, title, description, hasCloseButton } = props;

    const handleRemoveFromFavorites = (id) => {
        dispatch({ type: "REMOVE_FROM_FAVORITES", payload: { id } });
    };

    return (
        <Card className="NewsCard h-100 d-flex flex-column justify-content-between align-items-center">
            <Link to={`/news/${encodeURIComponent(newsId)}`}>
                <Card.Img variant="top" src={imgSrc ? imgSrc : defaultImageUrl} />
                <Card.Body>
                    <Card.Title>{title}</Card.Title>
                    <Card.Text>{description}</Card.Text>
                </Card.Body>
            </Link>
            {hasCloseButton && (
                <Button
                    variant="light"
                    onClick={() => handleRemoveFromFavorites(newsId)}
                >
                    <span className="material-icons text-dark">close</span>
                </Button>
            )}
        </Card>
    );
}

export default NewsCard;
