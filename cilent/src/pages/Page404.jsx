import { Link } from "react-router-dom";
import "./Page404.css";
import Container from "react-bootstrap/Container";

function Page404() {
  return (
    <div className="Page404 bg-primary text-white d-flex flex-column justify-content-center align-items-center">
      <Container className="d-flex flex-column justify-content-center align-items-center">
        <p className="h4 text-center">
          Trang bạn tìm kiếm không tồn tại
        </p>
        <strong className="error404">404 :(</strong>
        <p className="h4 text-center">
          Đây là {" "}
          <Link to="/" className="text-secondary">
           Trang chủ
          </Link>{" "}
          bấm để trở lại
        </p>
      </Container>
    </div>
  );
}

export default Page404;
