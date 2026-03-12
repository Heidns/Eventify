import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiUserLine, RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine, RiCalendarEventLine } from 'react-icons/ri';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

export default function Signup() {
  const { signup, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) { navigate('/'); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Please fill in all fields'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    try {
      setLoading(true);
      await signup(form.email, form.password, form.name, form.role);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.code === 'auth/email-already-in-use' ? 'Email is already registered' : err.message);
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', padding: '14px 14px 14px 44px', borderRadius: '10px',
    border: 'none', background: '#2a2a3d', color: '#fff', fontSize: '14px', outline: 'none',
  };
  const iconStyle = { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontSize: '18px' };

  return (
    <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', minHeight: '100vh', display: 'flex', background: '#111827' }}>

      {/* LEFT — Form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 64px', maxWidth: '560px' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '36px' }}>
          <RiCalendarEventLine style={{ fontSize: '28px', color: '#10b981' }} />
          <span style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>Eventify</span>
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Create an account</h1>
        <p style={{ color: '#9ca3af', fontSize: '15px', marginBottom: '32px' }}>Join us and start booking events!</p>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div style={{ position: 'relative', marginBottom: '14px' }}>
            <RiUserLine style={iconStyle} />
            <input
              type="text"
              placeholder="Username"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
            />
          </div>

          {/* Email */}
          <div style={{ position: 'relative', marginBottom: '14px' }}>
            <RiMailLine style={iconStyle} />
            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={inputStyle}
            />
          </div>

          {/* Password */}
          <div style={{ position: 'relative', marginBottom: '14px' }}>
            <RiLockLine style={iconStyle} />
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={{ ...inputStyle, paddingRight: '44px' }}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '18px' }}
            >
              {showPass ? <RiEyeOffLine /> : <RiEyeLine />}
            </button>
          </div>

          {/* Confirm Password */}
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <RiLockLine style={iconStyle} />
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              style={{ ...inputStyle, paddingRight: '44px' }}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '18px' }}
            >
              {showConfirm ? <RiEyeOffLine /> : <RiEyeLine />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px', borderRadius: '10px',
              background: '#10b981', color: '#fff', fontWeight: 700, fontSize: '15px',
              border: 'none', cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.7 : 1, transition: 'all 0.3s',
            }}
            onMouseOver={(e) => { if (!loading) e.currentTarget.style.background = '#059669'; }}
            onMouseOut={(e) => e.currentTarget.style.background = '#10b981'}
          >
            {loading ? 'Creating Account...' : 'Create account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '14px', marginTop: '24px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#10b981', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>

      {/* RIGHT — Hero Image */}
      <div style={{ flex: 1, display: 'flex', minHeight: '100vh' }}>
        <img
          src="/auth-hero.png"
          alt="Colorful hot air balloon over green hills"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </div>
  );
}
