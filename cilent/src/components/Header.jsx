import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import DropdownMenu from './DropdownMenu';
import './Header.css';

const types = ['Euro 2024', 'Bóng đá', 'Marathon','Tennis','Đua xe', 'Võ thuật','Các môn khác', 'Trong nước',
  'Thể thao', 'Chuyện bên lề'
];

function Header() {
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  function handleMenuClick() {
    setIsDisplayed((prevIsDisplayed) => !prevIsDisplayed);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername(null);
    navigate('/login');
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
              menu
            </span>

              {!username ? (
                  <div className="greeting-logout">
                    <Link
                        to="/login"
                        className="p-3 text-uppercase text-light"
                        style={{ ...linkStyle, ...linkHoverStyle }}
                    >
                      Đăng nhập
                    </Link>
                    <Link
                        to="/register"
                        className="p-3 text-uppercase text-light"
                        style={{ ...linkStyle, ...linkHoverStyle }}
                    >
                      Đăng ký
                    </Link>
                  </div>
              ) : (
                  <div className="greeting-logout">
                    <span className="greeting">Chào: {username}</span>
                    <button className="logout" onClick={handleLogout}>
                      Đăng xuất
                    </button>
                  </div>
              )}
              <ul className={dropdownMenuClasses}>
                <li className={isDisplayed ? "container" : null}>
                  <Link
                      to="/latesNews"
                      className="p-3 text-uppercase text-light"
                      style={{ ...linkStyle, ...linkHoverStyle }}
                  >
                    Tin Mới Nhất
                  </Link>
                </li>
                <li className={isDisplayed ? "container nav-item" : "nav-item"}>
                <span
                    className="p-3 text-uppercase text-light"
                    style={{ ...linkStyle, ...linkHoverStyle }}
                >
                  Thể Thao
                </span>
                  <DropdownMenu items={types} onItemClick={(type) => console.log(type)} />
                </li>
                <li className={isDisplayed ? "container" : null}>
                  <Link
                      to="/standings"
                      className="p-3 text-uppercase text-light"
                      style={{ ...linkStyle, ...linkHoverStyle }}
                  >
                    Bảng xếp hạng
                  </Link>
                </li>
                <li className={isDisplayed ? "container" : null}>
                  <Link
                      to="/matches"
                      className="p-3 text-uppercase text-light"
                      style={{ ...linkStyle, ...linkHoverStyle }}
                  >
                    Kết quả
                  </Link>
                </li>
                <li className={isDisplayed ? "container" : null}>
                  <Link
                      to="/favorites"
                      className="p-3 text-uppercase text-light"
                      style={{ ...linkStyle, ...linkHoverStyle }}
                  >
                    Ưa Thích
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
