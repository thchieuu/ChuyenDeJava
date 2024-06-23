import React from 'react';
import { Link } from 'react-router-dom';
import './DropdownMenu.css';

function DropdownMenu({ items, onItemClick }) {
    return (
        <div className="dropdown-menu">
            {items.map((item) => (
                <Link
                    to={`/news/type/${encodeURIComponent(item)}`}
                    key={item}
                    className="dropdown-item"
                    onClick={() => onItemClick(item)}
                >
                    {item}
                </Link>
            ))}
        </div>
    );
}

export default DropdownMenu;
