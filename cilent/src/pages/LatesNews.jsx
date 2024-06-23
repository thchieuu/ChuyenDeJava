// LatesNews.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NewsCardList from '../components/NewsCardList';
import Layout from '../components/Layout';
import PaginationComponent from '../components/Pagination'; // Import component Pagination

function LatestNews() {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Số lượng tin tức trên mỗi trang

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

    const indexOfLastNews = currentPage * itemsPerPage;
    const indexOfFirstNews = indexOfLastNews - itemsPerPage;
    const currentNews = newsList.slice(indexOfFirstNews, indexOfLastNews);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Layout>
            <section className="latest-news my-5">
                <div className="container">
                    <h1 className="mb-5">Tin Mới Nhất</h1>
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
            </section>
        </Layout>
    );
}

export default LatestNews;
