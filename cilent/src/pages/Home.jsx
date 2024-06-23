import React, { useEffect, useState } from "react";
import SimpleHomePage from "./SimpleHomePage";
import Layout from "../components/Layout";
import Container from "react-bootstrap/Container";
import NewsCardList from "../components/NewsCardList";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";

function Home() {
    const [newsData, setNewsData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        fetch('http://localhost:7000/api/news')
            .then(response => response.json())
            .then(data => {
                setNewsData(data);
            })
            .catch(error => {
                console.error('Error fetching news data:', error);
            });
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = newsData.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <Layout>
            <SimpleHomePage />
            <section className="sports my-5">
                <Container>
                    <h1 className="mb-5 pt-3">Thể Thao</h1>
                    <NewsCardList newsList={currentItems} />
                    <Pagination
                        itemsPerPage={itemsPerPage}
                        totalItems={newsData.length}
                        currentPage={currentPage}
                        paginate={setCurrentPage}
                    />
                    <p>
                        Xem tất cả tin tức liên quan đến thể thao trong mục{" "}
                        <Link to="/category/sports" className="text-secondary">
                            Thể Thao
                        </Link>
                        .
                    </p>
                </Container>
            </section>
        </Layout>
    );
}

export default Home;
