import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  RiCheckboxCircleLine,
  RiShieldCheckLine,
  RiCustomerService2Line,
  RiDoubleQuotesR,
} from 'react-icons/ri';

/* ─── scroll-reveal hook ─── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.unobserve(el); } },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, visible];
}

/* ─── static data ─── */
const features = [
  { icon: RiCheckboxCircleLine, title: 'Easy to Use', desc: 'Intuitive interface for creating and managing events effortlessly.' },
  { icon: RiShieldCheckLine, title: 'Secure Bookings', desc: 'Trusted by thousands for seamless and secure transactions.' },
  { icon: RiCustomerService2Line, title: '24/7 Support', desc: 'Dedicated support team available to assist you anytime.' },
];

const testimonials = [
  { quote: "The easiest platform I've ever used to organize my events. Simply brilliant!", name: 'Priya S.', avatar: '/priya.png' },
  { quote: 'Booking tickets was a breeze, and the event experience was amazing!', name: 'Arjun M.', avatar: '/arjun.png' },
  { quote: 'Highly recommend! The team is super supportive, and the features are top-notch.', name: 'Ananya R.', avatar: '/ananya.png' },
];

const trustedLogos = ['IIIT Delhi', 'VIT Vellore', 'BITS Pilani'];

/* ─── component ─── */
export default function Home() {

  const [featRef, featVis] = useReveal();
  const [testRef, testVis] = useReveal();
  const [ctaRef, ctaVis] = useReveal();

  return (
    <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', overflow: 'hidden' }}>
      {/* ═══════════ 1. HERO ═══════════ */}
      <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80"
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)' }} />

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px', maxWidth: '720px', margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.75rem)', fontWeight: 800, lineHeight: 1.15, color: '#fff', marginBottom: '20px' }}>
            Event Booking <span style={{ color: '#34d399' }}>Made Simple</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#d1d5db', marginBottom: '40px' }}>
            One place for all your event needs
          </p>
          <Link
            to="/create-event"
            style={{
              display: 'inline-block', padding: '16px 48px', borderRadius: '8px',
              background: '#10b981', color: '#fff', fontWeight: 700, fontSize: '1rem',
              textDecoration: 'none', transition: 'all 0.3s',
              boxShadow: '0 8px 24px rgba(16,185,129,0.3)',
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#10b981'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Create Event
          </Link>
        </div>
      </section>

      {/* ═══════════ TRUSTED BY ═══════════ */}
      <section style={{ background: '#fff', padding: '48px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: '14px', fontWeight: 700, color: '#1f2937', letterSpacing: '1px', marginBottom: '24px' }}>Trusted by</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
          {trustedLogos.map((name) => (
            <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%', border: '2px solid #d1d5db',
                display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6',
              }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#374151' }}>
                  {name.split(' ').map((w) => w[0]).join('')}
                </span>
              </div>
              <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: 500 }}>{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ 2. WHY CHOOSE US ═══════════ */}
      <section
        ref={featRef}
        style={{
          background: '#f9fafb', padding: '96px 24px', textAlign: 'center',
          transition: 'all 0.7s', opacity: featVis ? 1 : 0, transform: featVis ? 'translateY(0)' : 'translateY(40px)',
        }}
      >
        <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, color: '#111827', marginBottom: '60px' }}>
          Why Choose <span style={{ color: '#10b981' }}>Us?</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', maxWidth: '1100px', margin: '0 auto' }}>
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px',
                padding: '48px 32px', textAlign: 'center', cursor: 'pointer',
                transition: 'all 0.3s', transitionDelay: `${i * 100}ms`,
              }}
              onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-6px)'; }}
              onMouseOut={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{
                width: '56px', height: '56px', borderRadius: '12px', background: '#ecfdf5',
                color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', margin: '0 auto 20px',
              }}>
                <f.icon />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>



      {/* ═══════════ 4. TESTIMONIALS ═══════════ */}
      <section
        ref={testRef}
        style={{
          background: '#f9fafb', padding: '96px 24px', textAlign: 'center',
          transition: 'all 0.7s', opacity: testVis ? 1 : 0, transform: testVis ? 'translateY(0)' : 'translateY(40px)',
        }}
      >
        <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, color: '#111827', marginBottom: '60px' }}>
          What Our <span style={{ color: '#10b981' }}>Users Say</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', maxWidth: '1100px', margin: '0 auto' }}>
          {testimonials.map((t, i) => (
            <div
              key={i}
              style={{
                background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px',
                padding: '40px 24px', textAlign: 'center',
                transition: 'all 0.3s', transitionDelay: `${i * 100}ms`,
              }}
              onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'; }}
              onMouseOut={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 20px' }}>
                <img src={t.avatar} alt={t.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid #34d399' }} />
                <div style={{
                  position: 'absolute', bottom: '-4px', right: '-4px', width: '28px', height: '28px',
                  borderRadius: '50%', background: '#10b981', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px',
                }}>
                  <RiDoubleQuotesR />
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', fontStyle: 'italic', lineHeight: 1.7, marginBottom: '16px' }}>
                {t.quote}
              </p>
              <p style={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ 5. CTA ═══════════ */}
      <section
        ref={ctaRef}
        style={{
          background: '#059669', padding: '96px 24px', textAlign: 'center',
          transition: 'all 0.7s', opacity: ctaVis ? 1 : 0, transform: ctaVis ? 'translateY(0)' : 'translateY(40px)',
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
            Ready to Start Your Event Journey?
          </h2>
          <p style={{ color: '#d1fae5', fontSize: '1.1rem', marginBottom: '40px' }}>
            Join thousands of successful event organizers who trust our platform
          </p>
          <Link
            to="/signup"
            style={{
              display: 'inline-block', padding: '16px 48px', borderRadius: '8px',
              background: '#fff', color: '#059669', fontWeight: 700, fontSize: '1rem',
              textDecoration: 'none', transition: 'all 0.3s',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#ecfdf5'; e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
