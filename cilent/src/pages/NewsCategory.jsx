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

  );
}

export default NewsCategory;
