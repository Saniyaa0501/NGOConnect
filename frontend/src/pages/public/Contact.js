import React, { useState } from 'react';
import PublicNav from './PublicNav';
import './PublicPages.css';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="public-page">
      <PublicNav />

      <section className="contact-hero" style={{ background: '#121212' }}>
        <h1>Get in Touch</h1>
        <p>Have questions? We'd love to hear from you.</p>
      </section>

      <section className="contact-content">
        <div className="contact-info">
          <h3>Contact Details</h3>
          <p> NGOConnect HQ, Mumbai, India</p>
          <p> contact@ngoconnect.org</p>
          <p> +91 98765 43210</p>
        </div>

        <div className="contact-form">
          {sent && <div className="contact-success">Thank you! We'll get back to you soon.</div>}
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Your email" />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your message" rows="5" />
          </div>
          <button className="btn-hero-primary" onClick={handleSubmit}>Send Message</button>
        </div>
      </section>
    </div>
  );
}

export default Contact;