import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { RiCalendarEventLine } from 'react-icons/ri';

export default function Navbar() {
  const { user, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    setMenuOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <nav style={{ background: '#1e293b', borderBottom: '1px solid #334155', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>

        {/* Left: Logo + Explore */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <RiCalendarEventLine style={{ fontSize: '22px', color: '#10b981' }} />
            <span style={{ fontSize: '17px', fontWeight: 700, color: '#fff' }}>Eventify</span>
          </Link>
          <Link to="/explore" style={{ fontSize: '14px', color: '#cbd5e1', textDecoration: 'none', fontWeight: 500 }}>
            Explore events
          </Link>
        </div>

        {/* Right: Desktop */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: '16px' }}>
          {user ? (
            <>
              {/* Profile with dropdown */}
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff', overflow: 'hidden' }}>
                    {userProfile?.profileImage ? (
                      <img src={userProfile.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      (userProfile?.name?.slice(0, 2) || 'U').toLowerCase()
                    )}
                  </div>
                  <span style={{ fontSize: '14px', color: '#e2e8f0', fontWeight: 500 }}>
                    {userProfile?.name || 'Profile'}
                  </span>
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0, minWidth: '200px',
                    background: '#fff', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                    padding: '8px 0', zIndex: 100,
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>My Account</p>
                    </div>
                    <div style={{ padding: '10px 16px', borderBottom: '1px solid #f1f5f9' }}>
                      <p style={{ fontSize: '14px', color: '#374151', margin: 0 }}>Balance: ₹0</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      style={{ display: 'block', padding: '10px 16px', fontSize: '14px', color: '#374151', textDecoration: 'none' }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/my-events"
                      onClick={() => setDropdownOpen(false)}
                      style={{ display: 'block', padding: '10px 16px', fontSize: '14px', color: '#374151', textDecoration: 'none' }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      My Events
                    </Link>
                    <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '4px' }}>
                      <button
                        onClick={handleLogout}
                        style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: '14px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#fef2f2'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Create Event button */}
              <Link
                to="/create-event"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#10b981', color: '#fff', fontSize: '13px', fontWeight: 600, padding: '8px 16px', borderRadius: '8px', textDecoration: 'none' }}
              >
                <RiCalendarEventLine style={{ fontSize: '16px' }} />
                Create Event
              </Link>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn-secondary" style={{ fontSize: '13px', padding: '8px 16px' }}>
                Login
              </Link>
              <Link to="/signup" className="btn-primary" style={{ fontSize: '13px', padding: '8px 16px' }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          style={{ color: '#cbd5e1', background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px' }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden" style={{ borderTop: '1px solid #334155', padding: '12px 24px', background: '#1e293b' }}>
          <Link to="/explore" style={{ display: 'block', fontSize: '14px', color: '#cbd5e1', textDecoration: 'none', padding: '8px 0' }} onClick={() => setMenuOpen(false)}>
            Explore events
          </Link>
          {user ? (
            <>
              <Link to="/my-events" style={{ display: 'block', fontSize: '14px', color: '#cbd5e1', textDecoration: 'none', padding: '8px 0' }} onClick={() => setMenuOpen(false)}>
                My Events
              </Link>
              <Link to="/create-event" style={{ display: 'block', fontSize: '14px', color: '#10b981', textDecoration: 'none', padding: '8px 0', fontWeight: 600 }} onClick={() => setMenuOpen(false)}>
                Create Event
              </Link>
              <Link to="/profile" style={{ display: 'block', fontSize: '14px', color: '#cbd5e1', textDecoration: 'none', padding: '8px 0' }} onClick={() => setMenuOpen(false)}>
                Profile
              </Link>
              <button onClick={handleLogout} style={{ display: 'block', fontSize: '14px', color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0', width: '100%', textAlign: 'left' }}>
                Sign out
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
              <Link to="/login" className="btn-secondary" style={{ flex: 1, textAlign: 'center', fontSize: '13px' }} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="btn-primary" style={{ flex: 1, textAlign: 'center', fontSize: '13px' }} onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
