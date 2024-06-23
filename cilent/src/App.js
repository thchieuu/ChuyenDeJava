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
import Login from "./pages/Login";
import Register from "./pages/Register";
import LeagueStandings from "./pages/LeagueStandings";
import MatchDetails from "./pages/MatchDetails";
import LatestNews from "./pages/LatesNews";
import EuroNews from "./pages/EuroNews";
import AdminRoutes from "./admin/pages/AdminRoutes";
import { getRoleFromToken } from "./utils/hooks/useAuth";

// import "./admin/components/css/main.css" ;

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
  {
    path: "/standings",
    element: <LeagueStandings />,
  },
  {
    path: "/matches",
    element: <MatchDetails />,
  },
  {
    path: "/latesNews",
    element: <LatestNews />,
  },
  {
    path: "/news/type/:type",
    element: <EuroNews />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/admin/*",
    element: <AdminRoutes isAdmin={getRoleFromToken() === 'admin'} />,
  },
  {
    path: "/standings",
    element: <LeagueStandings />,
  },
  {
    path: "/matches",
    element: <MatchDetails />,
  },
  {
    path: "/latesNews",
    element: <LatestNews />,
  },
  {
    path: "/news/type/:type",
    element: <EuroNews />,
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
