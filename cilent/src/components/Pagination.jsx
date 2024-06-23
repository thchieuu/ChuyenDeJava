import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

const PaginationComponent = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
    const pageNumbers = [];
    const maxPageNumbersToShow = 5; // Số lượng trang hiển thị trong thanh chuyển trang
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);

    if (endPage - startPage + 1 < maxPageNumbersToShow) {
        startPage = Math.max(1, endPage - maxPageNumbersToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <Pagination className="justify-content-center"> {/* Sử dụng lớp justify-content-center của Bootstrap */}
            <Pagination.First
                onClick={() => paginate(1)}
                disabled={currentPage === 1}
            />
            <Pagination.Prev
                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                disabled={currentPage === 1}
            />
            {pageNumbers.map(number => (
                <Pagination.Item
                    key={number}
                    active={number === currentPage}
                    onClick={() => paginate(number)}
                >
                    {number}
                </Pagination.Item>
            ))}
            <Pagination.Next
                onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
            />
            <Pagination.Last
                onClick={() => paginate(totalPages)}
                disabled={currentPage === totalPages}
            />
        </Pagination>
    );
};

export default PaginationComponent;
