import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Users,
  IndianRupee,
  HandHeart,
  ArrowRight,
  Search,
  Gift,
  Sparkles,
  Quote,
  Star,
  Send,
} from 'lucide-react';
import api from '../../api/axios';
import PublicNav from './PublicNav';
import './PublicPages.css';

const steps = [
  {
    icon: Search,
    title: 'Discover',
    desc: 'Explore verified beneficiaries and causes that need real support.',
  },
  {
    icon: Heart,
    title: 'Support',
    desc: 'Contribute funds or offer your time — every bit counts.',
  },
  {
    icon: Gift,
    title: 'We Deliver',
    desc: 'Your contribution is tracked and routed to the right beneficiary.',
  },
  {
    icon: Sparkles,
    title: 'Create Impact',
    desc: 'Together, we build a fairer, more supported community.',
  },
];

const causes = [
  {
    image: '/images/donation.jpg',
    tag: 'Ongoing',
    title: 'Food Distribution Drive',
    desc: 'Providing daily meals to underprivileged families across Mumbai, supported entirely by donor contributions.',
  },
  {
    image: '/images/education.jpg',
    tag: 'Ongoing',
    title: 'Education for All',
    desc: 'Supporting rural classrooms with learning materials, uniforms, and volunteer teaching support.',
  },
];

const testimonials = [
  {
    quote: 'NGOConnect made it easy for me to find genuine causes. I love how transparent and trustworthy the platform is.',
    name: 'Ananya Sharma',
    role: 'Donor',
  },
  {
    quote: 'Volunteering through NGOConnect has been a rewarding experience. It feels great to be part of real, visible impact.',
    name: 'Rohit Verma',
    role: 'Volunteer',
  },
  {
    quote: 'Thanks to the support we received, we could provide education and essentials to so many children in need.',
    name: 'Neha Patil',
    role: 'NGO Partner',
  },
];

function Home() {
  const [stats, setStats] = useState({ total_donations: 0, total_amount: 0, total_beneficiaries: 0 });
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    api.get('auth/public-stats/').then((r) => setStats(r.data)).catch(() => {});
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <div className="public-page">
      <PublicNav />

      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge"><Heart size={13} /> Together, We Can</div>
          <h1>Connecting People.<br />Creating <span>Impact.</span></h1>
          <p>NGOConnect is a platform that connects kind hearts with meaningful causes. Your support can change lives and build a better tomorrow.</p>
          <div className="hero-actions">
            <Link to="/signup" className="btn-hero-primary">Donate Now <ArrowRight size={16} /></Link>
            <Link to="/campaigns" className="btn-hero-secondary">Explore Campaigns</Link>
          </div>
        </div>

        <div className="hero-video-wrapper">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="hero-video"
          >
            <source src="/videos/ngo-hero.mp4" type="video/mp4" />
          </video>
        </div>

      </section>

      <section className="stats-section">
        <div className="stats-box">
          <div className="stat-item">
            <div className="stat-icon"><Users size={22} /></div>
            <div>
              <h2>{stats.total_beneficiaries}+</h2>
              <p>Lives Impacted</p>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon"><HandHeart size={22} /></div>
            <div>
              <h2>{stats.total_donations}+</h2>
              <p>Donations Received</p>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon"><IndianRupee size={22} /></div>
            <div>
              <h2>₹{Number(stats.total_amount || 0).toLocaleString('en-IN')}+</h2>
              <p>Funds Raised</p>
            </div>
          </div>
        </div>
      </section>

      <section className="projects-section">
        <span className="eyebrow">Our Causes</span>
        <h2 className="section-title">Support Causes That Matter</h2>
        <p className="section-sub">Verified beneficiaries who need your support right now</p>
        <div className="projects-grid">
          {causes.map((c) => (
            <div className="project-card" key={c.title}>
              <div className="project-card-image">
                <img src={c.image} alt={c.title} />
                <span className="project-tag">{c.tag}</span>
              </div>
              <div className="project-card-body">
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <Link to="/signup" className="project-card-link">
                  Donate Now <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link to="/campaigns" className="btn-hero-secondary">
            View All Campaigns <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="how-it-works">
        <span className="eyebrow">How It Works</span>
        <h2 className="section-title">Simple Steps, Big Impact</h2>
        <p className="section-sub">Four simple steps to make a real difference</p>
        <div className="steps-grid">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <React.Fragment key={s.title}>
                <div className="step-card">
                  <div className="step-number">{String(i + 1).padStart(2, '0')}</div>
                  <div className="step-icon"><Icon size={22} /></div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="step-arrow"><ArrowRight size={20} /></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </section>

      <section className="testimonials-section">
        <span className="eyebrow">What People Say</span>
        <h2 className="section-title">Voices of Change</h2>
        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div className="testimonial-card" key={t.name}>
              <Quote size={26} className="testimonial-quote-icon" />
              <p className="testimonial-text">{t.quote}</p>
              <div className="testimonial-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="#FF6B00" stroke="#FF6B00" />
                ))}
              </div>
              <div className="testimonial-person">
                <div className="testimonial-avatar">{t.name.charAt(0)}</div>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-overlay" />
        <div className="cta-content">
          <h2>Be the Reason Someone <span>Smiles</span> Today</h2>
          <p>Every small contribution counts. Join us in making a big difference.</p>
          <div className="cta-actions">
            <Link to="/signup" className="btn-hero-primary">Donate Now <ArrowRight size={16} /></Link>
            <Link to="/signup" className="btn-hero-secondary">Volunteer Now <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <footer className="public-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="public-logo">
              <span className="public-logo-mark"><Heart size={16} strokeWidth={2.5} /></span>
              <span className="public-logo-text">NGO<span>Connect</span></span>
            </div>
            <p>Connecting people with purpose. Creating impact together.</p>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/campaigns">Campaigns</Link>
            <Link to="/contact">Contact Us</Link>
          </div>

          <div className="footer-col">
            <h4>Get Involved</h4>
            <Link to="/signup">Become a Volunteer</Link>
            <Link to="/signup">Donate Now</Link>
            <Link to="/signup">Create an Account</Link>
          </div>

          <div className="footer-col footer-newsletter">
            <h4>Newsletter</h4>
            <p>Stay updated with our latest campaigns and impact stories.</p>
            {subscribed ? (
              <p className="newsletter-success">Thanks for subscribing!</p>
            ) : (
              <form className="newsletter-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" aria-label="Subscribe"><Send size={16} /></button>
              </form>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 NGOConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;