import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// ============================================================================
// IMPORTANT: For your local Vite project, uncomment these real imports 
// and delete the "MOCKS" section below once you've created those files.
// ============================================================================
// import { db, storage } from '../config/firebase'; 
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { Timestamp } from 'firebase/firestore';
// import { useAuth } from '../context/AuthContext.jsx';
// import { createEvent, EVENT_CATEGORIES } from '../services/eventService.js';

// --- MOCKS FOR SAFE COMPILATION (DELETE THIS SECTION LOCALLY) ---
const storage = {};
const ref = () => ({});
const uploadBytes = async () => ({ ref: {} });
const getDownloadURL = async () => 'https://via.placeholder.com/150';
const Timestamp = { fromDate: (date) => date };
const useAuth = () => ({ user: { uid: '123' }, userProfile: { name: 'Organizer' } });
const createEvent = async () => new Promise(resolve => setTimeout(resolve, 1000));
const EVENT_CATEGORIES = ['Hackathon', 'Workshop', 'Cultural Fest', 'Seminar', 'Sports'];
// ----------------------------------------------------------------------------

export default function CreateEvent() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  // 1. Form State
  const [form, setForm] = useState({
    title: '',
    price: 0,
    seats: 10,
    category: '',
    date: '',
    description: '',
    coverImage: '',
    location: '',
  });

  // 2. Upload & UI State
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null); // Holds the actual file to upload
  const fileInputRef = useRef(null);

  // 3. Handle File Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Save the file object for Firebase upload later
      // Create a temporary local URL so the user can see the preview immediately
      setForm({ ...form, coverImage: URL.createObjectURL(file) });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // 4. Handle Form Submission
  const handleSubmit = async (e, status = 'published') => {
    e.preventDefault();

    if (!form.title || !form.description || !form.date || !form.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      let finalCoverImageUrl = form.coverImage;

      // IF a file was selected, upload it to Firebase Storage first
      if (imageFile) {
        const imageRef = ref(storage, `event_covers/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        finalCoverImageUrl = await getDownloadURL(snapshot.ref);
      }

      // Save the event to Firestore
      await createEvent({
        title: form.title,
        price: Number(form.price),
        seats: Number(form.seats),
        category: form.category,
        date: Timestamp.fromDate(new Date(form.date)),
        description: form.description,
        coverImage: finalCoverImageUrl, // Use the uploaded Firebase URL (or pasted URL)
        location: form.location,
        organizerId: user?.uid || 'anonymous',
        organizerName: userProfile?.name || 'Organizer',
        status,
      });

      toast.success(status === 'draft' ? 'Saved as draft!' : 'Event published!');
      navigate('/my-events'); // Redirect back to dashboard/my-events

    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  // Shared styles
  const inputCls = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    background: '#fff',
    color: '#111827',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelCls = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '6px',
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '40px 24px 80px' }}>
      <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: '48px 56px' }}>

        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', textAlign: 'center', marginBottom: '36px' }}>Create Your Event</h1>

        <form onSubmit={(e) => handleSubmit(e, 'published')}>

          {/* Row 1: Title | Price + Seats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            {/* Event Title */}
            <div>
              <label style={labelCls}>Event Title *</label>
              <input
                type="text"
                style={inputCls}
                placeholder="Enter event title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            {/* Price + Seats side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelCls}>Price (₹) *</label>
                <input
                  type="number"
                  min="0"
                  style={inputCls}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div>
                <label style={labelCls}>Seats *</label>
                <input
                  type="number"
                  min="1"
                  style={inputCls}
                  value={form.seats}
                  onChange={(e) => setForm({ ...form, seats: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Row 2: Category | Date & Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div>
              <label style={labelCls}>Category *</label>
              <select
                style={{ ...inputCls, appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e")', backgroundPosition: 'right 10px center', backgroundRepeat: 'no-repeat', backgroundSize: '18px', paddingRight: '36px' }}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="" disabled>Select category</option>
                {EVENT_CATEGORIES ? EVENT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                )) : null}
              </select>
            </div>

            <div>
              <label style={labelCls}>Date & Time *</label>
              <input
                type="datetime-local"
                style={inputCls}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
          </div>

          {/* Row 3: Description | Event Image */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div>
              <label style={labelCls}>Description *</label>
              <textarea
                style={{ ...inputCls, resize: 'vertical', minHeight: '140px', lineHeight: '1.5' }}
                placeholder="Describe your event..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{form.description.length}/250 characters</p>
            </div>

            <div>
              <label style={labelCls}>Event Image</label>

              {/* HIDDEN FILE INPUT */}
              <input
                type="file"
                style={{ display: 'none' }}
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/gif"
                onChange={handleImageChange}
              />

              {/* CLICKABLE DASHED DROP ZONE */}
              <div
                onClick={triggerFileInput}
                style={{
                  border: '2px dashed #d1d5db',
                  borderRadius: '10px',
                  background: '#f9fafb',
                  minHeight: '140px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer' /* Important for UX */
                }}
              >
                {form.coverImage ? (
                  <img src={form.coverImage} alt="Preview" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px' }} />
                ) : (
                  <>
                    <svg stroke="currentColor" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" style={{ width: '32px', height: '32px', color: '#9ca3af', marginBottom: '8px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <p style={{ fontSize: '13px', color: '#374151' }}>
                      <span style={{ color: '#10b981', fontWeight: 600 }}>Upload a file</span> or drag and drop
                    </p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>PNG, JPG, GIF up to 10MB</p>
                  </>
                )}
              </div>

              {/* URL FALLBACK INPUT */}
              <input
                type="url"
                style={{ ...inputCls, marginTop: '10px', fontSize: '13px' }}
                placeholder="Or paste image URL (e.g. https://...)"
                value={form.coverImage}
                onChange={(e) => {
                  setImageFile(null); // Clear the file if they manually paste a URL instead
                  setForm({ ...form, coverImage: e.target.value });
                }}
              />
            </div>
          </div>

          {/* Row 4: Location */}
          <div style={{ marginBottom: '32px' }}>
            <label style={labelCls}>Location *</label>
            <input
              type="text"
              style={{ ...inputCls, maxWidth: '50%' }}
              placeholder="e.g., Main Auditorium"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); handleSubmit(e, 'draft'); }}
              disabled={loading}
              style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', color: '#374151', fontWeight: '500', fontSize: '14px', cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ padding: '10px 28px', borderRadius: '8px', border: 'none', background: '#10b981', color: '#fff', fontWeight: '600', fontSize: '14px', cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Publishing...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}