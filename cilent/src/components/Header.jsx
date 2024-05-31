import { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import Container from "react-bootstrap/Container";

function Header() {
  const [isDisplayed, setIsDisplayed] = useState(false);

  function handleMenuClick() {
    setIsDisplayed((prevIsDisplayed) => !prevIsDisplayed);
  }

  let dropdownMenuClasses = "custom-dropdown-menu";
  if (isDisplayed) {
    dropdownMenuClasses += " display-mobile-menu";
  }

  const linkStyle = {
    padding: "10px",
    transition: "transform 0.3s, box-shadow 0.3s", 
    display: "inline-block",
    textDecoration: "none", 
    color: "#fff", 
  };

  const linkHoverStyle = {
    border: "black",
    transform: "translateY(-3px)", 
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    borderRadius: "20%",
  };

  return (
    <header className="Header">
      <nav className="nav">
        <Container className="d-flex justify-content-between align-items-center">
          <Link to="/" className="p-3">
            <img
              src="../../nlu.png"
              alt="website logo"
            />
          </Link>
          <div className="menu-icon-container">
            <span
              onClick={handleMenuClick}
              className="material-icons menu-icon text-light"
            >
              {" "}
              menu{" "}
            </span>
            <ul className={dropdownMenuClasses}>
              <li className={isDisplayed ? "container" : null}>
                <Link
                  to="/category/travel"
                  className="p-3 text-uppercase text-light"
                  style={{...linkStyle, ...linkHoverStyle}}
                >
                  Travel 
                </Link>
              </li>
              <li className={isDisplayed ? "container" : null}>
                <Link
                  to="/category/food"
                  className="p-3 text-uppercase text-light"
                  style={{...linkStyle, ...linkHoverStyle}}
                >
                  Food
                </Link>
              </li>
              <li className={isDisplayed ? "container" : null}>
                <Link
                  to="/category/fashion"
                  className="p-3 text-uppercase text-light"
                  style={{...linkStyle, ...linkHoverStyle}}
                >
                  Fashion
                </Link>
              </li>
              <li className={isDisplayed ? "container" : null}>
                <Link 
                  to="/category/science" 
                  className="p-3 text-uppercase text-light"
                  style={{...linkStyle, ...linkHoverStyle}}
                  >
                  Science
                </Link>
              </li>
              <li className={isDisplayed ? "container" : null}>
                <Link 
                  to="/category/music" 
                  className="p-3 text-uppercase text-light"
                  style={{...linkStyle, ...linkHoverStyle}}
                  >
                  Music
                </Link>
              </li>
              <li className={isDisplayed ? "container" : null}>
                <Link 
                  to="/category/film" 
                  className="p-3 text-uppercase text-light"
                  style={{...linkStyle, ...linkHoverStyle}}
                  >
                  film
                </Link>
              </li>
              <li className={isDisplayed ? "container" : null}>
                <Link 
                  to="/favorites" 
                  className="p-3 text-uppercase text-light"
                  style={{...linkStyle, ...linkHoverStyle}}
                  >
                  Favorite
                </Link>
              </li>
            </ul>
          </div>
        </Container>
      </nav>
    </header>
  );
}

export default Header;