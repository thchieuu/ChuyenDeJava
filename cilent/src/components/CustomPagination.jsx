import Pagination from 'react-bootstrap/Pagination';
import { useNavigate } from "react-router-dom";

function CustomPagination(props) {
    const { active, baseUrl } = props;
    let navigate = useNavigate();

    let items = [];
    for (let number = 1; number <= 5; number++) {
      items.push(
        <Pagination.Item key={number} active={number === active} onClick={() => {
            navigate(`${baseUrl}?page=${number}`);
        }}>
          {number}
        </Pagination.Item>,
      );
    }
    return<Pagination>{items}</Pagination>
}

export default CustomPagination
