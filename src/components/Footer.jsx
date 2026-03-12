import React from 'react';
import { Link } from 'react-router-dom';
import { RiCalendarEventLine } from 'react-icons/ri';

export default function Footer() {
  return (
    <footer style={{ background: '#0f172a', borderTop: '1px solid #1e293b', padding: '56px 24px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '12px' }}>
              <RiCalendarEventLine style={{ fontSize: '24px', color: '#34d399' }} />
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>Eventify</span>
            </Link>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6, marginTop: '8px' }}>
              Making event management simple and efficient.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link to="/" style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'none' }}>About</Link></li>
              <li><Link to="/explore" style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'none' }}>Contact</Link></li>
              <li><Link to="/signup" style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'none' }}>Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Features</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><span style={{ fontSize: '14px', color: '#94a3b8' }}>Event Management</span></li>
              <li><span style={{ fontSize: '14px', color: '#94a3b8' }}>Ticket Sales</span></li>
              <li><span style={{ fontSize: '14px', color: '#94a3b8' }}>Analytics</span></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Connect</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><a href="#" style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'none' }}>Twitter</a></li>
              <li><a href="#" style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'none' }}>LinkedIn</a></li>
              <li><a href="#" style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'none' }}>Facebook</a></li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1e293b', marginTop: '40px', padding: '32px 0', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            © {new Date().getFullYear()} Eventify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
