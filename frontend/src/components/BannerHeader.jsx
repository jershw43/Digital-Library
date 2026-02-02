import React, { useState } from 'react';

const BannerHeader = ({ title, subtitle, menuItems }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Inline styles for the banner
  const headerStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    width: '100%',
    position: 'fixed',
    top : '0',
    left: '0',
    zIndex: '1000',
  };

  const titleStyle = {
  margin: '0',
  fontSize: '2.5rem',
  paddingLeft: '60px', // Add this line to push the title to the right
};

  const subtitleStyle = {
    margin: '5px 0 0',
    fontSize: '1.2rem',
  };

  // Hamburger menu styles
  const menuContainerStyle = {
    position: 'absolute',
    left: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
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
    backgroundColor: 'white',
    transition: 'all 0.3s',
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    left: '0',
    backgroundColor: 'white',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    borderRadius: '4px',
    minWidth: '200px',
    marginTop: '10px',
    zIndex: 1000,
  };

  const menuItemStyle = {
    padding: '12px 20px',
    cursor: 'pointer',
    color: '#333',
    borderBottom: '1px solid #eee',
    transition: 'background-color 0.2s',
  };

  const lastMenuItemStyle = {
    ...menuItemStyle,
    borderBottom: 'none',
  };

  return (
    <header style={headerStyle}>
      {menuItems && menuItems.length > 0 && (
        <div style={menuContainerStyle}>
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
                  style={index === menuItems.length - 1 ? lastMenuItemStyle : menuItemStyle}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
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
      )}
      
      <h1 style={titleStyle}>{title}</h1>
      {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
    </header>
  );
};

export default BannerHeader;