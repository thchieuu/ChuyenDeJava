// store/favorites/context.js
import React, { createContext, useReducer } from 'react';

const FavoritesContext = createContext();

const initialState = {
    news: []
};

const favoritesReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_FAVORITES':
            // Kiểm tra nếu tin tức đã tồn tại trong danh sách yêu thích để tránh trùng lặp
            const newsExists = state.news.some(news => news._id === action.payload._id);
            if (newsExists) {
                return state;
            }
            return {
                ...state,
                news: [...state.news, action.payload]
            };
        case 'REMOVE_FROM_FAVORITES':
            return {
                ...state,
                news: state.news.filter(news => news._id !== action.payload.id)
            };
        default:
            return state;
    }
};

const FavoritesProvider = ({ children }) => {
    const [state, dispatch] = useReducer(favoritesReducer, initialState);

    return (
        <FavoritesContext.Provider value={{ state, dispatch }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export { FavoritesContext, FavoritesProvider };
