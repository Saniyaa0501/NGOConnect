import React from 'react';
import PublicNav from './PublicNav';
import './PublicPages.css';

function About() {
  return (
    <div className="public-page">
      <PublicNav />

      <section className="about-hero" style={{ background: '#121212' }}>
        <h1>About NGOConnect</h1>
        <p>Building bridges between generosity and genuine need.</p>
      </section>

      <section className="about-content">
        <div className="about-block">
          <h2>Our Mission</h2>
          <p>
            NGOConnect exists to make giving simple, transparent, and impactful. We connect donors
            directly with verified beneficiaries, ensuring every contribution reaches the people who
            need it most — with full visibility into how funds are used.
          </p>
        </div>

        <div className="about-block">
          <h2>What We Do</h2>
          <p>
            We manage donations, track beneficiary needs through a data-driven priority system, and
            coordinate volunteers for on-ground initiatives. Our platform brings structure and
            accountability to community support work.
          </p>
        </div>

        <div className="about-block">
          <h2>Our Values</h2>
          <ul className="about-values">
            <li><strong>Transparency</strong> — every donation is tracked and accounted for.</li>
            <li><strong>Fairness</strong> — beneficiaries are prioritized based on genuine need, not favoritism.</li>
            <li><strong>Community</strong> — volunteers and donors work together toward shared impact.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default About;