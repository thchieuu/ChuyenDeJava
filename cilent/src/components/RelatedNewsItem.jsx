// RelatedNewsItem.js
import React from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import styles from './RelatedNewsItem.module.css';

function RelatedNewsItem({ news }) {
    return (
        <Card className={`${styles.card} mb-2`}>
            <Link to={`/news/${news._id}`} className={styles.link}>
                <Card.Img variant="top" src={news.imgLinks[0]?.url} className={styles.image} />
                <Card.Body>
                    <Card.Title className={styles.title}>{news.title}</Card.Title>
                    <Card.Text className={styles.description}>
                        {news.description}
                    </Card.Text>
                </Card.Body>
            </Link>
        </Card>
    );
}

export default RelatedNewsItem;
