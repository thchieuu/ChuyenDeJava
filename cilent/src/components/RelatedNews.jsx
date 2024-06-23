// RelatedNews.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RelatedNewsItem from './RelatedNewsItem';
import styles from './RelatedNews.module.css';

function RelatedNews({ type }) {
    const [relatedNews, setRelatedNews] = useState([]);

    useEffect(() => {
        const fetchRelatedNews = async () => {
            try {
                const response = await axios.get(`http://localhost:7000/api/news/type/${type}`);
                const relatedNewsData = response.data.slice(1, 6); // Lấy tối đa 5 tin tức
                setRelatedNews(relatedNewsData);
            } catch (err) {
                console.error('Error fetching related news:', err);
            }
        };

        fetchRelatedNews();
    }, [type]);

    return (
        <div className={styles.relatedNewsContainer}>
            <h5 className={styles.title}>Tin tức liên quan</h5>
            {relatedNews.map((news) => (
                <RelatedNewsItem key={news._id} news={news} />
            ))}
        </div>
    );
}

export default RelatedNews;
