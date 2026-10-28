import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import '../PublicNav.css';

function PublicNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`public-navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="public-logo">
        <span className="public-logo-mark"><Heart size={16} strokeWidth={2.5} /></span>
        <span className="public-logo-text">NGO<span>Connect</span></span>
      </Link>

      <ul className={`public-nav-links ${menuOpen ? 'open' : ''}`}>
        <li><Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link></li>
        <li><Link to="/about" className={isActive('/about') ? 'active' : ''}>About Us</Link></li>
        <li><Link to="/campaigns" className={isActive('/campaigns') ? 'active' : ''}>Campaigns</Link></li>
        <li><Link to="/contact" className={isActive('/contact') ? 'active' : ''}>Contact Us</Link></li>
        <li className="public-nav-mobile-actions">
          <Link to="/login" className="btn-nav-login">Login</Link>
          <Link to="/signup" className="btn-nav-signup">Donate Now <Heart size={14} /></Link>
        </li>
      </ul>

      <div className="public-nav-actions">
        <Link to="/login" className="btn-nav-login">Login</Link>
        <Link to="/signup" className="btn-nav-signup">Donate Now <Heart size={14} /></Link>
      </div>

      <button
        className="public-nav-toggle"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </nav>
  );
}

export default PublicNav;