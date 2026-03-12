import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiEditLine } from 'react-icons/ri';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { updateUserProfile } from '../services/userService.js';
import { getOrganizerEvents } from '../services/eventService.js';

export default function Profile() {
  const { user, userProfile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Settings form state
  const [form, setForm] = useState({ name: '', organization: '', bio: '', profileImage: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setForm({
        name: userProfile.name || '',
        organization: userProfile.organization || '',
        bio: userProfile.bio || '',
        profileImage: userProfile.profileImage || '',
      });
    }
  }, [userProfile]);

  // Fetch user's events
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const data = await getOrganizerEvents(user.uid);
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingEvents(false);
      }
    })();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name) { toast.error('Name is required'); return; }
    try {
      setSaving(true);
      await updateUserProfile(user.uid, { ...form });
      await refreshProfile();
      toast.success('Profile updated!');
      setShowSettings(false);
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const memberYear = userProfile?.createdAt?.toDate
    ? userProfile.createdAt.toDate().getFullYear()
    : new Date().getFullYear();

  const initials = (userProfile?.name || 'U').slice(0, 2).toUpperCase();

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    border: '1px solid #d1d5db', background: '#fff', color: '#111827',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle = {
    display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px',
  };

  return (
    <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: '#f8fafc', minHeight: '100vh' }}>
      {/* ── Profile Header Card ── */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px 0' }}>
        <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '32px 36px', display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 700, color: '#64748b', overflow: 'hidden' }}>
              {userProfile?.profileImage ? (
                <img src={userProfile.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                initials
              )}
            </div>
            <button
              onClick={() => setShowSettings(true)}
              style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '28px', height: '28px', borderRadius: '50%', background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
            >
              <RiEditLine style={{ fontSize: '14px', color: '#475569' }} />
            </button>
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>{userProfile?.name || 'User'}</h2>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px' }}>{userProfile?.email || ''}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#10b981', background: '#ecfdf5', padding: '2px 10px', borderRadius: '12px' }}>
                {userProfile?.role || 'user'}
              </span>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>Member since {memberYear}</span>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              style={{ fontSize: '13px', fontWeight: 500, color: '#374151', background: '#fff', border: '1px solid #d1d5db', borderRadius: '8px', padding: '6px 16px', cursor: 'pointer' }}
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* ── Settings Panel (toggle) ── */}
      {showSettings && (
        <div style={{ maxWidth: '960px', margin: '16px auto 0', padding: '0 24px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '28px 36px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '20px' }}>Edit Profile</h3>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Profile Image URL</label>
                  <input style={inputStyle} placeholder="https://example.com/photo.jpg" value={form.profileImage} onChange={(e) => setForm({ ...form, profileImage: e.target.value })} />
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Organization / Club</label>
                <input style={{ ...inputStyle, maxWidth: '50%' }} placeholder="e.g., Tech Club" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Bio</label>
                <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} placeholder="Tell us about yourself..." value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" disabled={saving} style={{ fontSize: '13px', fontWeight: 600, color: '#fff', background: '#10b981', border: 'none', borderRadius: '8px', padding: '8px 20px', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => setShowSettings(false)} style={{ fontSize: '13px', fontWeight: 500, color: '#374151', background: '#fff', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 20px', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Tabs: Events / Reviews ── */}
      <div style={{ maxWidth: '960px', margin: '24px auto 0', padding: '0 24px' }}>
        <div style={{ borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '0' }}>
          <button
            onClick={() => setTab('events')}
            style={{
              fontSize: '14px', fontWeight: tab === 'events' ? 600 : 400,
              color: tab === 'events' ? '#111827' : '#6b7280',
              background: 'none', border: 'none', borderBottom: tab === 'events' ? '2px solid #111827' : '2px solid transparent',
              padding: '12px 20px', cursor: 'pointer',
            }}
          >
            Events
          </button>
          <button
            onClick={() => setTab('reviews')}
            style={{
              fontSize: '14px', fontWeight: tab === 'reviews' ? 600 : 400,
              color: tab === 'reviews' ? '#111827' : '#6b7280',
              background: 'none', border: 'none', borderBottom: tab === 'reviews' ? '2px solid #111827' : '2px solid transparent',
              padding: '12px 20px', cursor: 'pointer',
            }}
          >
            Reviews
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ padding: '40px 0 60px', textAlign: 'center' }}>
          {tab === 'events' && (
            loadingEvents ? (
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>Loading events...</p>
            ) : events.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>No events found</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px', textAlign: 'left' }}>
                {events.map((ev) => (
                  <div
                    key={ev.id}
                    onClick={() => navigate(`/events/${ev.id}`)}
                    style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden', cursor: 'pointer' }}
                  >
                    {ev.coverImage && (
                      <img src={ev.coverImage} alt="" style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                    )}
                    <div style={{ padding: '14px' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '0 0 4px' }}>{ev.title}</h4>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{ev.location || 'No location'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
          {tab === 'reviews' && (
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>No reviews yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
