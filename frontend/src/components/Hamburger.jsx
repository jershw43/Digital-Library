import React, { useState } from 'react';

const HamburgerMenu = ({ menuItems }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuStyle = {
    position: 'relative',
    display: 'inline-block',
  };

  const hamburgerStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const barStyle = {
    width: '25px',
    height: '3px',
    backgroundColor: 'var(--text-inverse)',
    transition: 'all 0.3s',
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    left: '0',
    backgroundColor: 'var(--surface)',
    boxShadow: '0 4px 8px var(--shadow)',
    borderRadius: '4px',
    minWidth: '200px',
    marginTop: '10px',
    zIndex: 1000,
  };

  const menuItemStyle = {
    padding: '12px 20px',
    cursor: 'pointer',
    color: 'var(--text)',
    borderBottom: '1px solid var(--border)',
    transition: 'background-color 0.2s',
  };

  return (
    <div style={menuStyle}>
      <button style={hamburgerStyle} onClick={toggleMenu} aria-label="Menu">
        <span style={barStyle}></span>
        <span style={barStyle}></span>
        <span style={barStyle}></span>
      </button>
      
      {isOpen && (
        <div style={dropdownStyle}>
          {menuItems.map((item, index) => (
            <div
              key={index}
              style={menuItemStyle}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--menu-hover)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;