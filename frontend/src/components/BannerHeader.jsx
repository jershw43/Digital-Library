import { useState } from 'react';

const BannerHeader = ({ title, menuItems, user, onLogout, onLogin }) => {
  const [isOpen, setIsOpen] = useState(false);

  const headerStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    width: '100%',
    position: 'fixed',
    top: '0',
    left: '0',
    zIndex: '1000',
    boxSizing: 'border-box',
  };

  const titleStyle = {
    margin: '0',
    fontSize: '2.5rem',
    paddingLeft: '60px',
  };

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
    display: 'block',
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    left: '0',
    backgroundColor: 'white',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
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

  // Auth section pinned to the right of the header
  const authSectionStyle = {
    position: 'absolute',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const usernameStyle = {
    color: 'white',
    fontSize: '0.95rem',
    fontWeight: '500',
  };

  const authButtonStyle = {
    backgroundColor: 'white',
    color: '#007bff',
    border: 'none',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  };

  return (
    <header style={headerStyle}>
      {/* Hamburger menu — left side */}
      {menuItems?.length > 0 && (
        <div style={menuContainerStyle}>
          <button
            style={hamburgerStyle}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            <span style={barStyle} />
            <span style={barStyle} />
            <span style={barStyle} />
          </button>

          {isOpen && (
            <div style={dropdownStyle}>
              {menuItems.map((item, i) => (
                <div
                  key={i}
                  style={{
                    ...menuItemStyle,
                    ...(i === menuItems.length - 1 ? { borderBottom: 'none' } : {}),
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#f5f5f5')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                  onClick={() => { item.onClick(); setIsOpen(false); }}
                >
                  {item.label}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <h1 style={titleStyle}>{title}</h1>

      {/* Auth section — right side */}
      <div style={authSectionStyle}>
        {user ? (
          <>
            <span style={usernameStyle}>Hi, {user.username}!</span>
            <button
              style={authButtonStyle}
              onClick={onLogout}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Log Out
            </button>
          </>
        ) : (
          <button
            style={authButtonStyle}
            onClick={onLogin}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Log In
          </button>
        )}
      </div>
    </header>
  );
};

export default BannerHeader;