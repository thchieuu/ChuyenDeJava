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
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [notFound, setNotFound] = useState(false);
    const itemsPerPage = 9;

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

    useEffect(() => {
        if (searchTerm) {
            fetch(`http://localhost:7000/api/news/search?q=${searchTerm}`)
                .then(response => {
                    if (response.status === 404) {
                        setSearchResults([]);
                        setNotFound(true);
                    } else {
                        return response.json();
                    }
                })
                .then(data => {
                    if (data) {
                        setSearchResults(data);
                        setNotFound(false);
                    }
                })
                .catch(error => {
                    console.error('Error searching news data:', error);
                });
        } else {
            setSearchResults([]);
            setNotFound(false);
        }
    }, [searchTerm]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = searchTerm ? searchResults.slice(indexOfFirstItem, indexOfLastItem) : newsData.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <Layout>
            <SimpleHomePage />
            <section className="sports my-5" style={{paddingLeft: 150, paddingRight: 150}}>
                <Container>
                    <div className="d-flex justify-content-end mb-3">
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="form-control "
                            style={{ maxWidth: "350px" }}
                        />
                    </div>
                    <h1 className="mb-5 pt-3">Thể Thao</h1>
                    {notFound && <p>Không tìm thấy kết quả</p>}
                    <NewsCardList newsList={currentItems} />
                    <Pagination
                        itemsPerPage={itemsPerPage}
                        totalItems={searchTerm ? searchResults.length : newsData.length}
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
