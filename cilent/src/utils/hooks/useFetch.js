import { useState, useEffect } from "react";

export function useFetch(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        setData(json);
      });
  }, [url]);

  return data;
}
export function getNewsCategoriesEndpoint(categoryId, page, limit) {
  return `/api/news/category/${categoryId}?page=${page}&limit=${limit}`;
}
