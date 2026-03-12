import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiEyeLine, RiDraftLine, RiCalendarEventLine } from 'react-icons/ri';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { getOrganizerEvents, updateEvent, deleteEvent } from '../services/eventService.js';

export default function Dashboard() {
  const { user, userProfile } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { if (user) loadEvents(); }, [user]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await getOrganizerEvents(user.uid);
      setEvents(data);
    } catch (err) {
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id) => {
    try {
      await updateEvent(id, { status: 'published' });
      setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status: 'published' } : e)));
      toast.success('Event published!');
    } catch (err) { toast.error('Failed to publish'); }
  };

  const handleUnpublish = async (id) => {
    try {
      await updateEvent(id, { status: 'draft' });
      setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status: 'draft' } : e)));
      toast.success('Moved to draft');
    } catch (err) { toast.error('Failed to update'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast.success('Event deleted');
    } catch (err) { toast.error('Failed to delete'); }
  };

  const formatDate = (dateVal) => {
    if (!dateVal) return 'TBD';
    const d = dateVal.toDate ? dateVal.toDate() : new Date(dateVal);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredEvents = events.filter((e) => {
    if (filter === 'published') return e.status === 'published';
    if (filter === 'draft') return e.status === 'draft';
    return true;
  });

  const publishedCount = events.filter((e) => e.status === 'published').length;
  const draftCount = events.filter((e) => e.status === 'draft').length;

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-slate-400">Welcome back, {userProfile?.name || 'Organizer'}</p>
        </div>
        <Link to="/create-event" className="btn-primary mt-4 sm:mt-0">
          <RiAddLine /> Create Event
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Total Events', value: events.length, color: 'text-primary-400' },
          { label: 'Published', value: publishedCount, color: 'text-emerald-400' },
          { label: 'Drafts', value: draftCount, color: 'text-yellow-400' },
        ].map((s, i) => (
          <div key={i} className="glass rounded-2xl p-6 text-center">
            <p className={`text-3xl font-bold ${s.color} mb-1`}>{s.value}</p>
            <p className="text-sm text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'all', label: 'All' },
          { key: 'published', label: 'Published' },
          { key: 'draft', label: 'Drafts' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === t.key
              ? 'bg-primary-600 text-white'
              : 'bg-surface-800 text-slate-400 hover:bg-surface-700'
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Events list */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="spinner" /></div>
      ) : filteredEvents.length > 0 ? (
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <div key={event.id} className="glass rounded-2xl p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-full md:w-24 h-32 md:h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={event.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&h=150&fit=crop'}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-white truncate">{event.title}</h3>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${event.status === 'published'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                    {event.status}
                  </span>
                </div>
                <p className="text-sm text-slate-400">{formatDate(event.date)} • {event.location || 'No location'}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link to={`/events/${event.id}`} className="p-2 rounded-lg bg-surface-800 text-slate-400 hover:text-white hover:bg-surface-700 transition-all" title="View">
                  <RiEyeLine />
                </Link>
                <Link to={`/edit-event/${event.id}`} className="p-2 rounded-lg bg-surface-800 text-slate-400 hover:text-primary-400 hover:bg-surface-700 transition-all" title="Edit">
                  <RiEditLine />
                </Link>
                {event.status === 'draft' ? (
                  <button onClick={() => handlePublish(event.id)} className="p-2 rounded-lg bg-surface-800 text-slate-400 hover:text-emerald-400 hover:bg-surface-700 transition-all" title="Publish">
                    <RiCalendarEventLine />
                  </button>
                ) : (
                  <button onClick={() => handleUnpublish(event.id)} className="p-2 rounded-lg bg-surface-800 text-slate-400 hover:text-yellow-400 hover:bg-surface-700 transition-all" title="Unpublish">
                    <RiDraftLine />
                  </button>
                )}
                <button onClick={() => handleDelete(event.id)} className="p-2 rounded-lg bg-surface-800 text-slate-400 hover:text-red-400 hover:bg-surface-700 transition-all" title="Delete">
                  <RiDeleteBinLine />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <RiCalendarEventLine className="text-5xl text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 text-lg mb-4">No events yet</p>
          <Link to="/create-event" className="btn-primary">Create Your First Event</Link>
        </div>
      )}
    </>
  );
}