// src/components/Pagination.jsx
import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

const PaginationComponent = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <Pagination>
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
                onClick={() => currentPage < pageNumbers.length && paginate(currentPage + 1)}
                disabled={currentPage === pageNumbers.length}
            />
        </Pagination>
    );
};

export default PaginationComponent;
