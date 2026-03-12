import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  RiCalendarLine,
  RiMapPinLine,
  RiUserLine,
  RiArrowLeftLine,
  RiCheckboxCircleLine,
} from 'react-icons/ri';
import toast from 'react-hot-toast';
import { getEventById } from '../services/eventService.js';
import { createBooking, getEventBookings } from '../services/bookingService.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function EventDetails() {
  const { id } = useParams();
  const { user, userProfile } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => { loadEvent(); }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const data = await getEventById(id);
      setEvent(data);

      if (user) {
        const bookings = await getEventBookings(id);
        setBooked(bookings.some((b) => b.userId === user.uid));
      }
    } catch (err) {
      console.error('Error loading event:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!user) { toast.error('Please login to book this event'); return; }
    try {
      setBooking(true);
      await createBooking({
        userId: user.uid,
        userName: userProfile?.name || 'User',
        eventId: id,
        eventTitle: event.title,
      });
      setBooked(true);
      toast.success('🎉 Booking confirmed!');
    } catch (err) {
      toast.error(err.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  const formatDate = (dateVal) => {
    if (!dateVal) return 'TBD';
    const d = dateVal.toDate ? dateVal.toDate() : new Date(dateVal);
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (dateVal) => {
    if (!dateVal) return '';
    const d = dateVal.toDate ? dateVal.toDate() : new Date(dateVal);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const defaultCover = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop';

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><div className="spinner" /></div>;

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-400 text-lg mb-4">Event not found</p>
        <Link to="/explore" className="btn-primary">Back to Events</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/explore" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-primary-400 transition-colors mb-6">
        <RiArrowLeftLine /> Back to events
      </Link>

      {/* Cover */}
      <div className="relative rounded-2xl overflow-hidden mb-8">
        <img src={event.coverImage || defaultCover} alt={event.title} className="w-full h-64 md:h-96 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950/70 to-transparent" />
        {event.category && (
          <span className="absolute top-4 left-4 px-4 py-1.5 text-sm font-semibold rounded-full bg-primary-600/80 text-white backdrop-blur-sm">
            {event.category}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{event.title}</h1>

          <div className="flex flex-wrap gap-4 mb-8 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <RiCalendarLine className="text-primary-400" />
              {formatDate(event.date)} {formatTime(event.date) && `at ${formatTime(event.date)}`}
            </span>
            {event.location && (
              <span className="flex items-center gap-2">
                <RiMapPinLine className="text-accent-400" />
                {event.location}
              </span>
            )}
            <span className="flex items-center gap-2">
              <RiUserLine className="text-primary-400" />
              by {event.organizerName || 'Organizer'}
            </span>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">About this Event</h2>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{event.description}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass rounded-2xl p-6 sticky top-24">
            <h3 className="text-lg font-bold text-white mb-4">Event Info</h3>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-sm">
                <RiCalendarLine className="text-primary-400 text-lg" />
                <div>
                  <p className="text-slate-400">Date & Time</p>
                  <p className="text-white font-medium">{formatDate(event.date)}</p>
                  {formatTime(event.date) && <p className="text-slate-300">{formatTime(event.date)}</p>}
                </div>
              </div>
              {event.location && (
                <div className="flex items-center gap-3 text-sm">
                  <RiMapPinLine className="text-accent-400 text-lg" />
                  <div>
                    <p className="text-slate-400">Location</p>
                    <p className="text-white font-medium">{event.location}</p>
                  </div>
                </div>
              )}
            </div>

            {booked ? (
              <div className="flex items-center gap-2 justify-center py-3 px-4 rounded-xl bg-emerald-500/20 text-emerald-400 font-semibold">
                <RiCheckboxCircleLine className="text-xl" />
                Booking Confirmed
              </div>
            ) : (
              <button onClick={handleBook} disabled={booking} className="w-full btn-primary justify-center !py-3 !rounded-xl">
                {booking ? 'Booking...' : 'Book Ticket / Register'}
              </button>
            )}

            {!user && (
              <p className="text-xs text-slate-500 text-center mt-3">
                <Link to="/login" className="text-primary-400 hover:underline">Login</Link> to book this event
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
