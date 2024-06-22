import {useReducer} from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Page404 from "./pages/Page404";
import Home from "./pages/Home";
import SimpleHomePage from "./pages/SimpleHomePage";
import Favorites from "./pages/Favorites";
import NewsCategory from "./pages/NewsCategory";
import NewsDetails from "./pages/NewsDetails";
import { initialState, favoritesReducer } from './store/favorites/reducer';
import { FavoritesContext } from './store/favorites/context';
import { useLocalStorage } from "./utils/hooks/useLocalStorage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Page404 />,
  },
  {
    path: "/favorites",
    element: <Favorites />,
  },
  {
    path: "/category/:categoryId",
    element: <NewsCategory />,
  },
  {
    path: "/news/:newsId",
    element: <NewsDetails />,
  },
  {
    path: "/simple-home",
    element: <SimpleHomePage />,
  },
]);

function App() {
  const [initialLocalStorageState] = useLocalStorage("favorites", initialState);
  const [state, dispatch] = useReducer(favoritesReducer, initialLocalStorageState);
  const favoritesContextValue = {
    state,
    dispatch,
  };

  return (
    <FavoritesContext.Provider value={favoritesContextValue}>
    <div className="App">
      <RouterProvider router={router} />
    </div>
    </FavoritesContext.Provider>
  );
}

export default App;
