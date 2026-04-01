import { useState } from 'react';

const BannerHeader = ({ title, menuItems, user, onLogout, onLogin }) => {
  const [isOpen, setIsOpen] = useState(false);

  const headerStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  paddingTop: 'max(20px, env(safe-area-inset-top))',
  paddingBottom: '20px',
  paddingLeft: '20px',
  paddingRight: '20px',
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
    fontSize: 'clamp(1rem, 4vw, 1.8rem)',
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    padding: '0 8px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const menuContainerStyle = {
    flexShrink: 0,
    position: 'relative',
  };

  const hamburgerStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    minHeight: '44px',
    justifyContent: 'center',
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
    marginTop: '8px',
    zIndex: 1001,
  };

  const menuItemStyle = {
    padding: '14px 20px',
    cursor: 'pointer',
    color: '#333',
    borderBottom: '1px solid #eee',
    transition: 'background-color 0.2s',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
  };

  const authSectionStyle = {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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
    minHeight: '36px',
    transition: 'opacity 0.2s',
    whiteSpace: 'nowrap',
  };

  return (
    <header style={headerStyle}>

      {/* Hamburger menu — left */}
      {menuItems?.length > 0 && (
        <div style={menuContainerStyle}>
          <button
            style={hamburgerStyle}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
            aria-expanded={isOpen}
          >
            <span style={barStyle} />
            <span style={barStyle} />
            <span style={barStyle} />
          </button>

          {isOpen && (
            <>
              {/* Invisible backdrop to close menu on outside tap */}
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 999 }}
                onClick={() => setIsOpen(false)}
              />
              <div style={{ ...dropdownStyle, zIndex: 1001 }}>
                {menuItems.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      ...menuItemStyle,
                      ...(i === menuItems.length - 1 ? { borderBottom: 'none' } : {}),
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    onClick={() => { item.onClick(); setIsOpen(false); }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Title — centre */}
      <h1 style={titleStyle}>{title}</h1>

      {/* Auth section — right */}
      <div style={authSectionStyle}>
        {user ? (
          <>
            <span className="header-username">Hi, {user.username}!</span>
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