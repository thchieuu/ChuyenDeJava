import React, { useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Layout from "../components/Layout";
import Container from "react-bootstrap/Container";
import NewsCardList from "../components/NewsCardList";
import { FavoritesContext } from "../store/favorites/context";

function Favorites() {
    const { state } = useContext(FavoritesContext);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // Chuyển hướng đến trang đăng nhập nếu không có token
        }
    }, [navigate]);

    return (
        <Layout>
            <Container>
                {state.news.length > 0 ? (
                    <NewsCardList newsList={state.news} showCloseButton={true} />
                ) : (
                    <p>Bạn chưa có tin tức ưa thích nào.</p>
                )}
            </Container>
        </Layout>
    );
}

export default Favorites;
