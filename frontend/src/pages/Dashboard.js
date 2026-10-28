import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Heart, Users, Briefcase, CalendarDays,
  TrendingUp, TrendingDown, AlertCircle,
  CheckCircle, Clock, ArrowRight, Activity,
  IndianRupee, UserCheck, Star
} from 'lucide-react';

const ORANGE   = '#FF6B00';
const DARK     = '#1a1a1a';
const BG       = '#f0f2f5';
const CARD_BG  = '#ffffff';
const BORDER   = '#e4e6ea';
const MUTED    = '#6b7280';
const FAINT    = '#9ca3af';

// ─── helpers ───────────────────────────────────────────────────────────────
const timeAgo = (ts) => {
  if (!ts) return '';
  const diff = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (diff < 60)  return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const fmt = (n) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000)     return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
};

const greet = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const today = () =>
  new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

// ─── sub-components ─────────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{
    background: CARD_BG, borderRadius: 16, border: `1px solid ${BORDER}`,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', ...style,
  }}>
    {children}
  </div>
);

const SectionTitle = ({ children }) => (
  <h2 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 700, color: DARK, letterSpacing: '-0.2px' }}>
    {children}
  </h2>
);

const Pill = ({ label, color, bg }) => (
  <span style={{
    display: 'inline-block', padding: '3px 10px', borderRadius: 20,
    fontSize: 11, fontWeight: 700, background: bg, color,
  }}>
    {label}
  </span>
);

const statusPill = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'completed' || s === 'active' || s === 'approved')
    return { label: 'Active',   color: '#16a34a', bg: '#dcfce7' };
  if (s === 'pending')
    return { label: 'Pending',  color: '#d97706', bg: '#fef3c7' };
  if (s === 'rejected' || s === 'inactive')
    return { label: 'Inactive', color: '#dc2626', bg: '#fee2e2' };
  return    { label: 'New',     color: '#6366f1', bg: '#eef2ff' };
};

// ─── mini SVG bar chart (last 6 months) ────────────────────────────────────
const MiniChart = ({ data, color, height = 40, width = 80 }) => {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data, 1);
  const barW = Math.floor((width - (data.length - 1) * 3) / data.length);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      {data.map((v, i) => {
        const bh = Math.max(3, Math.round((v / max) * height));
        return (
          <rect key={i}
            x={i * (barW + 3)} y={height - bh}
            width={barW} height={bh}
            rx={2} fill={color} opacity={i === data.length - 1 ? 1 : 0.35}
          />
        );
      })}
    </svg>
  );
};

// ─── main ───────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();

  const [donations,    setDonations]    = useState([]);
  const [beneficiaries,setBeneficiaries]= useState([]);
  const [volunteers,   setVolunteers]   = useState([]);
  const [events,       setEvents]       = useState([]);
  const [loading,      setLoading]      = useState(true);

  const fetchAll = useCallback(async () => {
    // ── mock data (remove when API auth is working) ──────────────
    const now = new Date();
    const mo  = (offset) => new Date(now.getFullYear(), now.getMonth() + offset, 10).toISOString();

    setDonations([
      { id:1, donor_name:'Rahul Sharma',  amount:'25000', status:'completed', date: mo(0),  created_at: mo(0)  },
      { id:2, donor_name:'Priya Mehta',   amount:'10000', status:'pending',   date: mo(0),  created_at: mo(0)  },
      { id:3, donor_name:'Amit Joshi',    amount:'50000', status:'completed', date: mo(-1), created_at: mo(-1) },
      { id:4, donor_name:'Sunita Rao',    amount:'5000',  status:'completed', date: mo(-1), created_at: mo(-1) },
      { id:5, donor_name:'Vikram Nair',   amount:'75000', status:'pending',   date: mo(-2), created_at: mo(-2) },
      { id:6, donor_name:'Anjali Singh',  amount:'15000', status:'completed', date: mo(-3), created_at: mo(-3) },
      { id:7, donor_name:'Rohit Desai',   amount:'30000', status:'completed', date: mo(-4), created_at: mo(-4) },
      { id:8, donor_name:'Meera Iyer',    amount:'8000',  status:'completed', date: mo(-5), created_at: mo(-5) },
    ]);
    setBeneficiaries([
      { id:1, name:'Geeta Bai',    priority_score:85, status:'active',   created_at: mo(0)  },
      { id:2, name:'Ramesh Kumar', priority_score:60, status:'active',   created_at: mo(0)  },
      { id:3, name:'Lakshmi Devi', priority_score:92, status:'pending',  created_at: mo(-1) },
      { id:4, name:'Suresh Babu',  priority_score:45, status:'active',   created_at: mo(-2) },
      { id:5, name:'Kavita Patil', priority_score:78, status:'active',   created_at: mo(-3) },
    ]);
    setVolunteers([
      { id:1, name:'Neha Gupta',   status:'active',   joined_date: mo(0)  },
      { id:2, name:'Arjun Reddy',  status:'pending',  joined_date: mo(0)  },
      { id:3, name:'Pooja Shah',   status:'active',   joined_date: mo(-1) },
      { id:4, name:'Karan Malhotra',status:'active',  joined_date: mo(-2) },
      { id:5, name:'Divya Nair',   status:'pending',  joined_date: mo(-3) },
    ]);
    setEvents([
      { id:1, title:'Health Camp',       start_date: new Date(now.getFullYear(), now.getMonth(), now.getDate()+5).toISOString()  },
      { id:2, title:'Food Drive',        start_date: new Date(now.getFullYear(), now.getMonth(), now.getDate()+12).toISOString() },
      { id:3, title:'Annual Gala',       start_date: mo(-1) },
      { id:4, title:'Awareness Walk',    start_date: mo(-2) },
      { id:5, title:'Skill Workshop',    start_date: new Date(now.getFullYear(), now.getMonth(), now.getDate()+20).toISOString() },
    ]);
    setLoading(false);
    // ────────────────────────────────────────────────────────────
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── derived numbers ──────────────────────────────────────────────────────
  const now   = new Date();
  const curMo = now.getMonth();
  const curYr = now.getFullYear();

  const inMonth = (arr, dateKey) =>
    arr.filter(x => {
      const d = new Date(x[dateKey] || x.created_at || '');
      return d.getMonth() === curMo && d.getFullYear() === curYr;
    }).length;

  const prevMonth = (arr, dateKey) =>
    arr.filter(x => {
      const d = new Date(x[dateKey] || x.created_at || '');
      return d.getMonth() === ((curMo - 1 + 12) % 12) && d.getFullYear() === (curMo === 0 ? curYr - 1 : curYr);
    }).length;

  const pct = (cur, prev) => {
    if (prev === 0) return cur > 0 ? 100 : 0;
    return Math.round(((cur - prev) / prev) * 100);
  };

  const totalDonations = donations.reduce((s, d) => s + parseFloat(d.amount || 0), 0);
  const monthDonations = donations
    .filter(x => { const d = new Date(x.date || x.created_at || ''); return d.getMonth() === curMo && d.getFullYear() === curYr; })
    .reduce((s, d) => s + parseFloat(d.amount || 0), 0);
  const prevMonthDon = donations
    .filter(x => { const d = new Date(x.date || x.created_at || ''); return d.getMonth() === ((curMo - 1 + 12) % 12); })
    .reduce((s, d) => s + parseFloat(d.amount || 0), 0);
  const donPct = pct(monthDonations, prevMonthDon);

  const benCur  = inMonth(beneficiaries, 'created_at');
  const benPrev = prevMonth(beneficiaries, 'created_at');
  const benPct  = pct(benCur, benPrev);

  const volCur  = inMonth(volunteers, 'joined_date');
  const volPrev = prevMonth(volunteers, 'joined_date');
  const volPct  = pct(volCur, volPrev);

  const evCur  = inMonth(events, 'start_date');
  const evPrev = prevMonth(events, 'start_date');
  const evPct  = pct(evCur, evPrev);

  // last-6-month bar chart data (donations amount by month)
  const last6 = Array.from({ length: 6 }, (_, i) => {
    const mo = (curMo - 5 + i + 12) % 12;
    return donations
      .filter(x => new Date(x.date || x.created_at || '').getMonth() === mo)
      .reduce((s, d) => s + parseFloat(d.amount || 0), 0);
  });

  // pending counts for Requires Attention
  const pendingDonations     = donations.filter(x => (x.status || '').toLowerCase() === 'pending').length;
  const highPriorityBen      = beneficiaries.filter(x => (x.priority_score || 0) > 70).length;
  const pendingVolunteers    = volunteers.filter(x => (x.status || '').toLowerCase() === 'pending').length;
  const upcomingEvents       = events.filter(x => x.start_date && new Date(x.start_date) > now).length;

  // recent activity (last 5 across all modules)
  const activityItems = [
    ...donations.slice(-3).map(x => ({
      icon: IndianRupee, color: ORANGE,
      desc: `Donation ${fmt(parseFloat(x.amount || 0))} from ${x.donor_name || 'Anonymous'}`,
      time: x.created_at || x.date, status: x.status,
    })),
    ...volunteers.slice(-2).map(x => ({
      icon: UserCheck, color: '#6366f1',
      desc: `${x.name || 'Volunteer'} registered as volunteer`,
      time: x.joined_date || x.created_at, status: x.status,
    })),
  ]
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 5);

  // ── module definitions ───────────────────────────────────────────────────
  const modules = [
    {
      icon: Heart, label: 'Donations',
      desc: 'Track and manage all donor contributions',
      stat1: { label: 'Total Raised',  value: fmt(totalDonations) },
      stat2: { label: 'This Month',    value: donations.length },
      pct: donPct, path: '/admin/donations',
      accent: ORANGE,
    },
    {
      icon: Users, label: 'Beneficiaries',
      desc: 'Manage aid recipients and priority cases',
      stat1: { label: 'Total',         value: beneficiaries.length },
      stat2: { label: 'High Priority', value: highPriorityBen },
      pct: benPct, path: '/admin/beneficiaries',
      accent: '#0ea5e9',
    },
    {
      icon: Briefcase, label: 'Volunteers',
      desc: 'Onboard and coordinate volunteer activity',
      stat1: { label: 'Total',         value: volunteers.length },
      stat2: { label: 'This Month',    value: volCur },
      pct: volPct, path: '/admin/volunteers',
      accent: '#10b981',
    },
    {
      icon: CalendarDays, label: 'Events',
      desc: 'Plan, publish and track NGO events',
      stat1: { label: 'Total Events',  value: events.length },
      stat2: { label: 'Upcoming',      value: upcomingEvents },
      pct: evPct, path: '/admin/events',
      accent: '#8b5cf6',
    },
  ];

  // ── attention items ──────────────────────────────────────────────────────
  const attentionItems = [
    { label: 'Pending Donations',    count: pendingDonations,  color: '#ef4444', bg: '#fef2f2',  path: '/admin/donations'      },
    { label: 'High Priority Cases',  count: highPriorityBen,   color: '#f59e0b', bg: '#fffbeb',  path: '/admin/beneficiaries'  },
    { label: 'Volunteer Approvals',  count: pendingVolunteers, color: '#6366f1', bg: '#eef2ff',  path: '/admin/volunteers'     },
    { label: 'Upcoming Events',      count: upcomingEvents,    color: '#10b981', bg: '#f0fdf4',  path: '/admin/events'         },
  ].filter(x => x.count > 0);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: MUTED, fontSize: 14 }}>
        Loading dashboard…
      </div>
    );
  }

  return (
    <div style={{ background: BG, minHeight: '100vh', padding: '28px 32px', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        {/* ── Header ─────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <p style={{ margin: 0, fontSize: 13, color: FAINT, fontWeight: 500 }}>{today()}</p>
            <h1 style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 800, color: DARK, letterSpacing: '-0.5px' }}>
              {greet()}, Admin 👋
            </h1>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 10,
            padding: '8px 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          }}>
            <Activity size={14} color={ORANGE} />
            <span style={{ fontSize: 12.5, color: MUTED, fontWeight: 600 }}>
              {donations.length + beneficiaries.length + volunteers.length + events.length} records total
            </span>
          </div>
        </div>

        {/* ── Management Modules — HERO ───────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <SectionTitle>Management Modules</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            {modules.map(({ icon: Icon, label, desc, stat1, stat2, pct: p, path, accent }) => (
              <Card key={label} style={{ padding: 0, overflow: 'hidden' }}>
                {/* accent bar */}
                <div style={{ height: 4, background: accent }} />
                <div style={{ padding: '22px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 13,
                        background: accent + '15',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={22} color={accent} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: DARK }}>{label}</h3>
                        <p style={{ margin: '3px 0 0', fontSize: 12.5, color: MUTED }}>{desc}</p>
                      </div>
                    </div>
                    {/* trend badge */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      background: p >= 0 ? '#f0fdf4' : '#fef2f2',
                      border: `1px solid ${p >= 0 ? '#bbf7d0' : '#fecaca'}`,
                      borderRadius: 8, padding: '4px 10px',
                    }}>
                      {p >= 0
                        ? <TrendingUp size={12} color="#16a34a" />
                        : <TrendingDown size={12} color="#dc2626" />}
                      <span style={{ fontSize: 12, fontWeight: 700, color: p >= 0 ? '#16a34a' : '#dc2626' }}>
                        {p >= 0 ? '+' : ''}{p}%
                      </span>
                    </div>
                  </div>

                  {/* stat row */}
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1,
                    background: BORDER, borderRadius: 10, overflow: 'hidden',
                    marginBottom: 18,
                  }}>
                    {[stat1, stat2].map(({ label: sl, value }) => (
                      <div key={sl} style={{ background: '#f8f9fb', padding: '12px 16px' }}>
                        <p style={{ margin: 0, fontSize: 11.5, color: FAINT, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{sl}</p>
                        <p style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 800, color: DARK }}>{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => navigate(path)}
                    style={{
                      width: '100%', padding: '10px 0', borderRadius: 9,
                      background: accent, border: 'none', cursor: 'pointer',
                      color: '#fff', fontSize: 13, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}
                  >
                    Manage {label} <ArrowRight size={14} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* ── Stats Strip ─────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Total Raised',    value: fmt(totalDonations), icon: IndianRupee, color: ORANGE   },
            { label: 'Beneficiaries',   value: beneficiaries.length, icon: Users,       color: '#0ea5e9' },
            { label: 'Volunteers',      value: volunteers.length,    icon: UserCheck,   color: '#10b981' },
            { label: 'Events Hosted',   value: events.length,        icon: CalendarDays,color: '#8b5cf6' },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, background: color + '12',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={18} color={color} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 11.5, color: FAINT, fontWeight: 600 }}>{label}</p>
                <p style={{ margin: '2px 0 0', fontSize: 18, fontWeight: 800, color: DARK }}>{value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* ── Bottom Row: Chart + Right Column ────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 18 }}>

          {/* Donation Overview chart */}
          <Card style={{ padding: '22px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <SectionTitle>Donation Overview</SectionTitle>
              <span style={{ fontSize: 12, color: MUTED }}>Last 6 months</span>
            </div>
            <DonationChart donations={donations} ORANGE={ORANGE} BORDER={BORDER} FAINT={FAINT} />
          </Card>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Requires Attention */}
            {attentionItems.length > 0 && (
              <Card style={{ padding: '20px 22px' }}>
                <SectionTitle>Requires Attention</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {attentionItems.map(({ label, count, color, bg, path }) => (
                    <div
                      key={label}
                      onClick={() => navigate(path)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 14px', borderRadius: 10,
                        background: bg, border: `1px solid ${color}20`,
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <AlertCircle size={14} color={color} />
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: DARK }}>{label}</span>
                      </div>
                      <span style={{
                        minWidth: 22, height: 22, borderRadius: '50%',
                        background: color, color: '#fff',
                        fontSize: 11, fontWeight: 800,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Recent Activity */}
            <Card style={{ padding: '20px 22px', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <SectionTitle>Recent Activity</SectionTitle>
                <span style={{ fontSize: 12, color: ORANGE, fontWeight: 700, cursor: 'pointer' }}>View All →</span>
              </div>
              {activityItems.length === 0 ? (
                <p style={{ color: FAINT, fontSize: 13, textAlign: 'center', padding: '10px 0' }}>No recent activity yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {activityItems.map((it, i) => {
                    const pill = statusPill(it.status);
                    const ago  = timeAgo(it.time);
                    const Icon = it.icon;
                    return (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '9px 12px', borderRadius: 10,
                        background: '#f8f9fb', border: `1px solid ${BORDER}`,
                      }}>
                        <div style={{
                          width: 28, height: 28, minWidth: 28, borderRadius: 8,
                          background: it.color + '15',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Icon size={13} color={it.color} />
                        </div>
                        <p style={{
                          margin: 0, fontSize: 12, color: DARK, fontWeight: 600,
                          flex: 1, minWidth: 0, overflow: 'hidden',
                          textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {it.desc}
                        </p>
                        {ago && <span style={{ fontSize: 11, color: FAINT, flexShrink: 0 }}>{ago}</span>}
                        <Pill label={pill.label} color={pill.color} bg={pill.bg} />
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Donation Overview SVG Chart ────────────────────────────────────────────
function DonationChart({ donations, ORANGE, BORDER, FAINT }) {
  const [period, setPeriod] = useState('monthly');
  const now = new Date();

  const buildData = () => {
    if (period === 'weekly') {
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now); d.setDate(d.getDate() - (6 - i));
        const label = d.toLocaleDateString('en-IN', { weekday: 'short' });
        const value = donations
          .filter(x => new Date(x.date || x.created_at || '').toDateString() === d.toDateString())
          .reduce((s, x) => s + parseFloat(x.amount || 0), 0);
        return { label, value };
      });
    }
    if (period === 'yearly') {
      return Array.from({ length: 5 }, (_, i) => {
        const yr = now.getFullYear() - (4 - i);
        const value = donations
          .filter(x => new Date(x.date || x.created_at || '').getFullYear() === yr)
          .reduce((s, x) => s + parseFloat(x.amount || 0), 0);
        return { label: String(yr), value };
      });
    }
    // monthly (last 6)
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const label = d.toLocaleDateString('en-IN', { month: 'short' });
      const value = donations
        .filter(x => {
          const dd = new Date(x.date || x.created_at || '');
          return dd.getMonth() === d.getMonth() && dd.getFullYear() === d.getFullYear();
        })
        .reduce((s, x) => s + parseFloat(x.amount || 0), 0);
      return { label, value };
    });
  };

  const data   = buildData();
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const W = 560, H = 160, padL = 10, padB = 28, padT = 10, padR = 10;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const pts = data.map((d, i) => ({
    x: padL + (i / (data.length - 1)) * innerW,
    y: padT + (1 - d.value / maxVal) * innerH,
    ...d,
  }));

  const polyline = pts.map(p => `${p.x},${p.y}`).join(' ');
  const area = [
    `M ${pts[0].x} ${padT + innerH}`,
    ...pts.map(p => `L ${p.x} ${p.y}`),
    `L ${pts[pts.length - 1].x} ${padT + innerH} Z`,
  ].join(' ');

  const tabs = ['weekly', 'monthly', 'yearly'];

  return (
    <div>
      {/* period toggle */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setPeriod(t)} style={{
            padding: '5px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
            cursor: 'pointer', border: `1.5px solid ${period === t ? ORANGE : BORDER}`,
            background: period === t ? ORANGE + '10' : '#fff',
            color: period === t ? ORANGE : FAINT,
          }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* chart */}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
        {/* grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(r => (
          <line key={r}
            x1={padL} x2={W - padR}
            y1={padT + r * innerH} y2={padT + r * innerH}
            stroke={BORDER} strokeWidth={1}
          />
        ))}
        {/* area fill */}
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={ORANGE} stopOpacity={0.2} />
            <stop offset="100%" stopColor={ORANGE} stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#chartGrad)" />
        {/* line */}
        <polyline points={polyline} fill="none" stroke={ORANGE} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {/* dots */}
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={4} fill="#fff" stroke={ORANGE} strokeWidth={2} />
        ))}
        {/* x labels */}
        {pts.map((p, i) => (
          <text key={i} x={p.x} y={H - 6} textAnchor="middle" fontSize={10} fill={FAINT} fontFamily="Inter, sans-serif">
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  );
}