import React from 'react';

const Footer = () => {
  return (
    <div className="text-center" style={{ fontSize: '13px' }}>
      <p>
        <b>
          Copyright {new Date().getFullYear()} Phần mềm quản lý tin tức thể thao
        </b>
      </p>
    </div>
  );
};

export default Footer;
