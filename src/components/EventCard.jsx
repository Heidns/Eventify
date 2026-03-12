import React from 'react';
import { Link } from 'react-router-dom';
import { RiCalendarLine, RiMapPinLine } from 'react-icons/ri';

export default function EventCard({ event }) {
  const formatDate = (dateVal) => {
    if (!dateVal) return 'TBD';
    const d = dateVal.toDate ? dateVal.toDate() : new Date(dateVal);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const defaultCover = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop';

  return (
    <Link
      to={`/events/${event.id}`}
      className="block glass rounded-2xl overflow-hidden card-hover group"
    >
      {/* Cover */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.coverImage || defaultCover}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950/80 to-transparent" />

        {event.category && (
          <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full bg-primary-600/80 text-white backdrop-blur-sm">
            {event.category}
          </span>
        )}

        {event.status === 'draft' && (
          <span className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500/80 text-white backdrop-blur-sm">
            Draft
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-primary-400 transition-colors">
          {event.title}
        </h3>

        <p className="text-sm text-slate-400 mb-3 line-clamp-2">
          {event.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <RiCalendarLine className="text-primary-400" />
            {formatDate(event.date)}
          </span>
          {event.location && (
            <span className="flex items-center gap-1">
              <RiMapPinLine className="text-accent-400" />
              <span className="line-clamp-1">{event.location}</span>
            </span>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-700/30 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            by {event.organizerName || 'Organizer'}
          </span>
          <span className="text-xs font-semibold text-primary-400 group-hover:text-accent-400 transition-colors">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
