export const ADD_TO_FAVORITES = "ADD_TO_FAVORITES";
export const REMOVE_FROM_FAVORITES = "REMOVE_FROM_FAVORITES";

export function addToFavorites(news) {
  return {
    type: ADD_TO_FAVORITES,
    payload: news,
  };
}

export function removeFromFavorites(newsId) {
  return {
    type: REMOVE_FROM_FAVORITES,
    payload: newsId,
  };
}
