import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NewsCardList from '../components/NewsCardList';
import Header from '../components/Header';
import SimpleHomePage from "./SimpleHomePage";
import Container from "react-bootstrap/Container";
import Layout from "../components/Layout";

function LatesNews() {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:7000/api/news');
                const sortedNews = response.data.sort((a, b) => new Date(b.isoTime) - new Date(a.isoTime));
                setNewsList(sortedNews);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    return (
        <Layout>
            <SimpleHomePage />
            <section className="sports my-5" style={{paddingLeft: 150, paddingRight: 150}}>
                <Container>
                    <div className="d-flex justify-content-end mb-3">
                        <div className="container mt-5">
                           <h1>Tin Mới Nhất</h1>
                              {error && <p className="text-danger">{error}</p>}
                                {loading ? (
                                <p>Loading...</p>
                                ) : (
                    <NewsCardList newsList={newsList} />
                )}
                        </div>
                     </div>
                </Container>
            </section>
        </Layout>
    );
}

export default LatesNews;
