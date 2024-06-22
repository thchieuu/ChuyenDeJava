import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import Container from "react-bootstrap/Container";
import NewsCardList from "../components/NewsCardList";
import CustomPagination from "../components/CustomPagination";

function NewsCategory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const { categoryId } = useParams();
  const [news, setNews] = useState([]);



  let title = "";
  switch (categoryId) {
    case "travel":
      title = "Travel";
      break;
    case "food":
      title = "Food";
      break;
    case "fashion":
      title = "Fashion";
      break;
    default:
      break;
  }

  return (
      <Layout>
        <Container className="my-5">
          <h1 className="mb-5 pt-3">{title}</h1>
          <NewsCardList newsList={news} />
          <CustomPagination active={currentPage} baseUrl={`/category/${categoryId}`} />
        </Container>
      </Layout>
  );
}

export default NewsCategory;
