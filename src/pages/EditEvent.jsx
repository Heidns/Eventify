import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RiImageAddLine } from 'react-icons/ri';
import toast from 'react-hot-toast';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext.jsx';
import { getEventById, updateEvent, EVENT_CATEGORIES } from '../services/eventService.js';

function toLocalDatetime(val) {
  if (!val) return '';
  const d = val.toDate ? val.toDate() : new Date(val);
  return d.toISOString().slice(0, 16);
}

export default function EditEvent() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: '',
    status: 'draft',
  });
  const [existingCover, setExistingCover] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadEvent(); }, [id]);

  const loadEvent = async () => {
    try {
      const event = await getEventById(id);
      if (!event || event.organizerId !== user.uid) {
        toast.error('Event not found or access denied');
        navigate('/my-events');
        return;
      }
      setForm({
        title: event.title || '',
        description: event.description || '',
        date: toLocalDatetime(event.date),
        location: event.location || '',
        category: event.category || '',
        status: event.status || 'draft',
      });
      setExistingCover(event.coverImage || '');
    } catch (err) {
      toast.error('Failed to load event');
      navigate('/my-events');
    } finally {
      setLoading(false);
    }
  };



  const handleSubmit = async (e, status) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.date) {
      toast.error('Please fill in title, description, and date');
      return;
    }
    try {
      setSaving(true);
      let coverImage = existingCover;

      await updateEvent(id, {
        title: form.title,
        description: form.description,
        date: Timestamp.fromDate(new Date(form.date)),
        location: form.location,
        category: form.category,
        coverImage,
        status: status || form.status,
      });

      toast.success('Event updated!');
      navigate('/my-events');
    } catch (err) {
      toast.error(err.message || 'Failed to update event');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-[40vh]"><div className="spinner" /></div>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Edit Event</h1>
      <p className="text-slate-400 mb-8">Update your event details below.</p>

      <form className="space-y-6">
        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Cover Image URL</label>
          <input 
            type="url" 
            className="input-field" 
            placeholder="https://example.com/image.jpg" 
            value={existingCover} 
            onChange={(e) => setExistingCover(e.target.value)} 
          />
          {existingCover && (
            <div className="mt-4 rounded-xl overflow-hidden h-48">
              <img src={existingCover} alt="Cover preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Title *</label>
          <input type="text" className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Description *</label>
          <textarea className="input-field" rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Date & Time *</label>
            <input type="datetime-local" className="input-field" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Location</label>
            <input type="text" className="input-field" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Category</label>
          <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="">Select category</option>
            {EVENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button type="button" onClick={(e) => handleSubmit(e, 'published')} disabled={saving} className="btn-primary justify-center !py-3 flex-1">
            {saving ? 'Saving...' : 'Publish Event'}
          </button>
          <button type="button" onClick={(e) => handleSubmit(e, 'draft')} disabled={saving} className="btn-secondary justify-center !py-3 flex-1">
            Save as Draft
          </button>
        </div>
      </form>
    </div>
  );
}
