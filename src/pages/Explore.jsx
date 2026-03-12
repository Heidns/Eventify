import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RiSearchLine, RiMapPin2Line, RiCalendarLine, RiMapPinLine, RiTicketLine } from 'react-icons/ri';
import { getPublishedEvents, EVENT_CATEGORIES } from '../services/eventService.js';

export default function Explore() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => { loadEvents(); }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const result = await getPublishedEvents({ pageSize: 12 });
      setEvents(result.events);
      setLastDoc(result.lastVisible);
      setHasMore(result.hasMore);
    } catch (err) {
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!lastDoc || loadingMore) return;
    try {
      setLoadingMore(true);
      const result = await getPublishedEvents({ pageSize: 12, lastDoc });
      setEvents((prev) => [...prev, ...result.events]);
      setLastDoc(result.lastVisible);
      setHasMore(result.hasMore);
    } catch (err) {
      console.error('Error loading more:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const filteredEvents = events.filter((e) => {
    const matchSearch =
      !searchTerm ||
      e.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLocation =
      !locationTerm ||
      e.location?.toLowerCase().includes(locationTerm.toLowerCase());
    const matchCategory = !selectedCategory || e.category === selectedCategory;
    return matchSearch && matchLocation && matchCategory;
  });

  const formatDate = (dateVal) => {
    if (!dateVal) return 'TBD';
    const d = dateVal.toDate ? dateVal.toDate() : new Date(dateVal);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
      + ', ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const defaultCover = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop';

  return (
    <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', overflow: 'hidden' }}>

      {/* ═══════════ HERO SEARCH BANNER ═══════════ */}
      <section style={{ position: 'relative', minHeight: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80"
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', fontWeight: 700, color: '#fff', marginBottom: '32px', fontStyle: 'italic' }}>
            Discover events for all the things you love!
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* Location input */}
            <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: '240px' }}>
              <RiMapPin2Line style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '16px' }} />
              <input
                type="text"
                placeholder="Enter Location"
                value={locationTerm}
                onChange={(e) => setLocationTerm(e.target.value)}
                style={{
                  width: '100%', padding: '12px 12px 12px 36px', borderRadius: '8px',
                  border: '1px solid #e5e7eb', background: '#fff', color: '#111', fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Search input */}
            <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: '240px' }}>
              <RiSearchLine style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '16px' }} />
              <input
                type="text"
                placeholder="Search Event"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%', padding: '12px 12px 12px 36px', borderRadius: '8px',
                  border: '1px solid #e5e7eb', background: '#fff', color: '#111', fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Search button */}
            <button
              onClick={() => {}}
              style={{
                padding: '12px 28px', borderRadius: '8px', background: '#10b981', color: '#fff',
                fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#059669'}
              onMouseOut={(e) => e.currentTarget.style.background = '#10b981'}
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════ CONTENT: SIDEBAR + EVENTS ═══════════ */}
      <section style={{ background: '#fff', padding: '48px 24px', minHeight: '60vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* LEFT SIDEBAR — Filters */}
          <aside style={{
            width: '240px', flexShrink: 0, background: '#fff', border: '1px solid #e5e7eb',
            borderRadius: '16px', padding: '28px 24px',
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>Filters</h3>

            {/* Category */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: '8px',
                  border: '1px solid #d1d5db', background: '#fff', color: '#374151',
                  fontSize: '14px', outline: 'none', cursor: 'pointer',
                }}
              >
                <option value="">Select category</option>
                {EVENT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>
                Date Range
              </label>
              <div style={{
                padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db',
                background: '#fff', color: '#6b7280', fontSize: '13px',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <RiCalendarLine style={{ color: '#9ca3af' }} />
                <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(Date.now() + 20 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>

            {/* Apply Filters */}
            <button
              onClick={() => {}}
              style={{
                width: '100%', padding: '12px', borderRadius: '8px',
                background: '#10b981', color: '#fff', fontWeight: 600, fontSize: '14px',
                border: 'none', cursor: 'pointer', transition: 'all 0.3s',
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#059669'}
              onMouseOut={(e) => e.currentTarget.style.background = '#10b981'}
            >
              Apply Filters
            </button>
          </aside>

          {/* RIGHT — Event Cards Grid */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid rgba(16,185,129,0.3)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              </div>
            ) : filteredEvents.length > 0 ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                  {filteredEvents.map((event) => (
                    <Link
                      key={event.id}
                      to={`/events/${event.id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <div
                        style={{
                          background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px',
                          overflow: 'hidden', transition: 'all 0.3s', cursor: 'pointer',
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                      >
                        {/* Cover Image */}
                        <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                          <img
                            src={event.coverImage || defaultCover}
                            alt={event.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          {/* Category badge */}
                          {event.category && (
                            <span style={{
                              position: 'absolute', top: '12px', left: '12px',
                              padding: '4px 12px', borderRadius: '6px',
                              background: '#1e293b', color: '#fff', fontSize: '12px', fontWeight: 600,
                            }}>
                              {event.category}
                            </span>
                          )}
                          {/* Seats badge */}
                          {event.maxAttendees && event.attendeeCount >= event.maxAttendees && (
                            <span style={{
                              position: 'absolute', top: '12px', right: '12px',
                              padding: '4px 10px', borderRadius: '6px',
                              background: '#ef4444', color: '#fff', fontSize: '11px', fontWeight: 600,
                            }}>
                              0 seats left
                            </span>
                          )}
                        </div>

                        {/* Card Info */}
                        <div style={{ padding: '16px 18px 20px' }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '10px', lineHeight: 1.3 }}>
                            {event.title}
                          </h3>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontSize: '13px', color: '#6b7280' }}>
                            <RiCalendarLine style={{ color: '#9ca3af', flexShrink: 0 }} />
                            <span>{formatDate(event.date)}</span>
                          </div>

                          {event.location && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontSize: '13px', color: '#6b7280' }}>
                              <RiMapPinLine style={{ color: '#9ca3af', flexShrink: 0 }} />
                              <span>{event.location}</span>
                            </div>
                          )}

                          {event.price !== undefined && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                              <RiTicketLine style={{ color: '#10b981' }} />
                              <span>{event.price > 0 ? `$${event.price.toFixed(2)}` : 'Free'}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {hasMore && (
                  <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      style={{
                        padding: '12px 32px', borderRadius: '8px',
                        background: loadingMore ? '#d1d5db' : '#10b981', color: '#fff',
                        fontWeight: 600, fontSize: '14px', border: 'none', cursor: loadingMore ? 'default' : 'pointer',
                        transition: 'all 0.3s',
                      }}
                    >
                      {loadingMore ? 'Loading...' : 'Load More Events'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <p style={{ color: '#9ca3af', fontSize: '1.1rem' }}>No events match your search. Try different keywords or categories.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
