// pages/Favorites.js
import React, { useContext } from "react";
import Layout from "../components/Layout";
import Container from "react-bootstrap/Container";
import NewsCardList from "../components/NewsCardList";
import { FavoritesContext } from "../store/favorites/context";

function Favorites() {
    const { state } = useContext(FavoritesContext);

    return (
        <Layout>
            <Container>
                {state.news.length > 0 ? (
                    <NewsCardList newsList={state.news} showCloseButton={true} />
                ) : (
                    <p>You don't have any favorite news yet.</p>
                )}
            </Container>
        </Layout>
    );
}

export default Favorites;
