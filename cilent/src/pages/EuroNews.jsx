// EuroNewsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NewsCardList from '../components/NewsCardList';
import Layout from '../components/Layout';
import PaginationComponent from '../components/Pagination'; // Import component Pagination
import SimpleHomePage from './SimpleHomePage';
import Container from 'react-bootstrap/Container';

function EuroNewsPage() {
    const { type } = useParams();
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Số lượng tin tức trên mỗi trang

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:7000/api/news/type/${encodeURIComponent(type)}`);
                const sortedNews = response.data.sort((a, b) => new Date(b.isoTime) - new Date(a.isoTime));
                setNewsList(sortedNews);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchNews();
    }, [type]);

    const indexOfLastNews = currentPage * itemsPerPage;
    const indexOfFirstNews = indexOfLastNews - itemsPerPage;
    const currentNews = newsList.slice(indexOfFirstNews, indexOfLastNews);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Layout>
            <SimpleHomePage />
            <section className="latest-news my-5">
                <Container>
                    <div className="container mt-5">
                        <h1>Tin Tức {type} Mới Nhất</h1>
                        {error && <p className="text-danger">{error}</p>}
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <>
                                <NewsCardList newsList={currentNews} />
                                <PaginationComponent
                                    itemsPerPage={itemsPerPage}
                                    totalItems={newsList.length}
                                    currentPage={currentPage}
                                    paginate={paginate}
                                />
                            </>
                        )}
                    </div>
                </Container>
            </section>
        </Layout>
    );
}

export default EuroNewsPage;
