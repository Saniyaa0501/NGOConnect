import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PublicNav from './PublicNav';
import './PublicPages.css';

const campaigns = [
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
  {
    image: '/images/donation.jpg',
    tag: 'Ongoing',
    title: 'Healthcare for Every Home',
    desc: 'Free medical checkups and essential medicines for families who cannot access basic healthcare.',
  },
  {
    image: '/images/education.jpg',
    tag: 'Ongoing',
    title: 'Winter Relief Drive',
    desc: 'Distributing blankets, warm clothing, and shelter support during the colder months.',
  },
  {
    image: '/images/donation.jpg',
    tag: 'Ongoing',
    title: 'Clean Water Initiative',
    desc: 'Installing water purification systems in communities with limited access to safe drinking water.',
  },
  {
    image: '/images/education.jpg',
    tag: 'Ongoing',
    title: 'Skill Development for Youth',
    desc: 'Vocational training programs helping young adults build careers and become self-reliant.',
  },
];

function Campaigns() {
  return (
    <div className="public-page">
      <PublicNav />

      {/* Page Header */}
      <section className="about-hero" style={{ background: '#121212' }}>
        <h1>Support Causes That Matter</h1>
        <p>Explore verified beneficiaries and ongoing campaigns. Every contribution — big or small — creates real, lasting impact.</p>
      </section>

      {/* Campaigns Grid */}
      <section className="projects-section">
        <span className="eyebrow">Our Causes</span>
        <h2 className="section-title">All Campaigns</h2>
        <p className="section-sub">Verified beneficiaries who need your support right now</p>
        <div className="projects-grid">
          {campaigns.map((c) => (
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
      </section>
    </div>
  );
}

export default Campaigns;