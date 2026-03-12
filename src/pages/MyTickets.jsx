import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RiTicketLine, RiCalendarLine, RiCheckboxCircleLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext.jsx';
import { getUserBookings } from '../services/bookingService.js';

export default function MyTickets() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadBookings();
  }, [user]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await getUserBookings(user.uid);
      setBookings(data);
    } catch (err) {
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = dateStr.toDate ? dateStr.toDate() : new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <RiTicketLine className="text-3xl text-primary-400" />
        <div>
          <h1 className="text-3xl font-bold text-white">My Tickets</h1>
          <p className="text-slate-400">Your booked events</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="spinner" />
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Link
              key={booking.id}
              to={`/events/${booking.eventId}`}
              className="block glass rounded-2xl p-5 card-hover"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-white mb-1 truncate">
                    {booking.eventTitle}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <RiCalendarLine className="text-primary-400" />
                      Booked on {formatDate(booking.bookingDate)}
                    </span>
                  </div>
                  {booking.qrCodeHash && (
                    <p className="text-xs text-slate-500 mt-2 font-mono">
                      Ticket: {booking.qrCodeHash.slice(0, 18)}…
                    </p>
                  )}
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 ${
                  booking.status === 'confirmed'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  <RiCheckboxCircleLine />
                  {booking.status || 'confirmed'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <RiTicketLine className="text-5xl text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 text-lg mb-4">No bookings yet</p>
          <Link to="/explore" className="btn-primary">
            Explore Events
          </Link>
        </div>
      )}
    </div>
  );
}
