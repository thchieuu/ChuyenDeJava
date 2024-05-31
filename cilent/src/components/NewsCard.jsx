import { useContext } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "./NewsCard.css";
import { removeFromFavorites } from "../store/favorites/actions";
import { FavoritesContext } from "../store/favorites/context";

function NewsCard(props) {
    const { dispatch } = useContext(FavoritesContext);
    const { newsId, imgSrc, title, description, hasCloseButton } = props;
    const defaultImgSrc = "../../tinthethao.png"; // Thay đổi đường dẫn này thành đường dẫn tới ảnh mặc định của bạn

    function handleRemoveFromFavorites(id) {
        const actionResult = removeFromFavorites(id);
        dispatch(actionResult);
    }

    return (
        <Card className="NewsCard h-100 d-flex flex-column">
            <Link to={`/news/${encodeURIComponent(newsId)}`} className="w-100">
                <Card.Img variant="top" src={imgSrc || defaultImgSrc} className="news-card-img" />
                <Card.Body className="d-flex flex-column">
                    <Card.Title className="news-card-title">{title}</Card.Title>
                    <Card.Text className="news-card-text">{description}</Card.Text>
                </Card.Body>
            </Link>
            {hasCloseButton && (
                <Button
                    variant="light"
                    onClick={() => {
                        handleRemoveFromFavorites(newsId);
                    }}
                    className="mt-auto align-self-end"
                >
                    <span className="material-icons text-dark">close</span>
                </Button>
            )}
        </Card>
    );
}

export default NewsCard;
