import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, HeartHandshake, Users, LogOut, HandHeart, Heart, Settings, Calendar } from 'lucide-react';
import logo from './assets/logo.png';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/Dashboard';
import UserDashboard from './pages/UserDashboard';
import UserDonate from './pages/UserDonate';
import UserBeneficiaries from './pages/UserBeneficiaries';
import UserVolunteer from './pages/UserVolunteer';
import Donations from './pages/Donations';
import Beneficiaries from './pages/Beneficiaries';
import Volunteers from './pages/Volunteers';
import ProfileSettings from './pages/ProfileSettings';
import Events from './pages/events/Events';
import EventDetails from './pages/events/EventDetails';
import UserEvents from './pages/events/UserEvents';
import './App.css';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Campaigns from './pages/public/Campaigns';

const ORANGE = '#FF6B00';
const DARK = '#1a1a1a';

const PrivateRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.username) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
};

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// ---- User side: unchanged vertical sidebar ----
function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const userLinks = [
    { path: '/user/dashboard', label: 'My Dashboard', Icon: LayoutDashboard },
    { path: '/user/donate', label: 'Make a Donation', Icon: Heart },
    { path: '/user/beneficiaries', label: 'Lives Impacted', Icon: Users },
    { path: '/user/volunteer', label: 'Join as Volunteer', Icon: HandHeart },
    { path: '/user/events', label: 'Events', Icon: Calendar },
    { path: '/user/profile', label: 'Profile & Settings', Icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img
          src={logo}
          alt="NGOConnect"
          style={{ width: 36, height: 36, objectFit: 'contain' }}
        />
        <span>NGOConnect</span>
      </div>
      <ul className="sidebar-links">
        {userLinks.map(link => (
          <li key={link.path}>
            <a href={link.path} className={isActive(link.path) ? 'active' : ''}>
              <link.Icon size={18} strokeWidth={2} className="sidebar-icon" />
              <span>{link.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function Topbar({ user, adminMode, onLogout }) {
  return (
    <div className="topbar">
      <div />
      <div className="topbar-right">
        <span className="topbar-user">
          {adminMode ? 'Admin: ' : ''}{user.username}
        </span>
        <button onClick={onLogout} className="btn btn-danger">
          <LogOut size={14} strokeWidth={2} style={{ marginRight: 6, verticalAlign: 'middle' }} />
          Logout
        </button>
      </div>
    </div>
  );
}

function UserLayout({ children }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const handleLogout = () => { localStorage.clear(); window.location.href = '/'; };
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-panel">
        <Topbar user={user} adminMode={false} onLogout={handleLogout} />
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

// ---- Admin side: minimal top bar only, no sidebar ----
function AdminLayout({ children }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const handleLogout = () => { localStorage.clear(); window.location.href = '/'; };
  return (
    <div>
      <div style={{
        background: DARK,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src={logo}
            alt="NGOConnect"
            style={{ width: 32, height: 32, objectFit: 'contain' }}
          />
          <span style={{ color: ORANGE, fontWeight: 800, fontSize: 16 }}>NGOConnect Admin</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ color: '#ccc', fontSize: 13 }}>Admin: {user.username}</span>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 999,
              border: 'none', background: '#e53935',
              color: '#fff', fontWeight: 600, fontSize: 12.5, cursor: 'pointer',
            }}
          >
            <LogOut size={14} strokeWidth={2} />
            Logout
          </button>
        </div>
      </div>

      <div style={{ padding: '24px 32px', maxWidth: '100%' }}>{children}</div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* User routes */}
        <Route path="/user/dashboard" element={<PrivateRoute><UserLayout><UserDashboard /></UserLayout></PrivateRoute>} />
        <Route path="/user/donate" element={<PrivateRoute><UserLayout><UserDonate /></UserLayout></PrivateRoute>} />
        <Route path="/user/beneficiaries" element={<PrivateRoute><UserLayout><UserBeneficiaries /></UserLayout></PrivateRoute>} />
        <Route path="/user/volunteer" element={<PrivateRoute><UserLayout><UserVolunteer /></UserLayout></PrivateRoute>} />
        <Route path="/user/events" element={<PrivateRoute><UserLayout><UserEvents /></UserLayout></PrivateRoute>} />
        <Route path="/user/profile" element={<PrivateRoute><UserLayout><ProfileSettings /></UserLayout></PrivateRoute>} />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<PrivateRoute role="admin"><AdminLayout><Dashboard /></AdminLayout></PrivateRoute>} />
        <Route path="/admin/donations" element={<PrivateRoute role="admin"><AdminLayout><Donations isAdmin={true} /></AdminLayout></PrivateRoute>} />
        <Route path="/admin/beneficiaries" element={<PrivateRoute role="admin"><AdminLayout><Beneficiaries isAdmin={true} /></AdminLayout></PrivateRoute>} />
        <Route path="/admin/volunteers" element={<PrivateRoute role="admin"><AdminLayout><Volunteers isAdmin={true} /></AdminLayout></PrivateRoute>} />
        <Route path="/admin/events" element={<PrivateRoute role="admin"><AdminLayout><Events isAdmin={true} /></AdminLayout></PrivateRoute>} />
        <Route path="/admin/events/:id" element={<PrivateRoute role="admin"><AdminLayout><EventDetails /></AdminLayout></PrivateRoute>} />
        <Route path="/admin/profile" element={<PrivateRoute role="admin"><AdminLayout><ProfileSettings /></AdminLayout></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;