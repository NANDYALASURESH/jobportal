import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          💼 JobPortal
        </Link>
        <ul className="navbar-nav">
          <li><Link to="/jobs" className={isActive('/jobs')}>Browse Jobs</Link></li>
          {user ? (
            <>
              {isAdmin() ? (
                <>
                  <li><Link to="/admin/dashboard" className={isActive('/admin/dashboard')}>Dashboard <span className="nav-badge">Admin</span></Link></li>
                  <li><Link to="/admin/jobs" className={isActive('/admin/jobs')}>Manage Jobs</Link></li>
                  <li><Link to="/admin/applications" className={isActive('/admin/applications')}>Applications</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/my-applications" className={isActive('/my-applications')}>My Applications</Link></li>
                </>
              )}
              <li>
                <span style={{ padding: '.5rem', fontSize: '.85rem', color: 'var(--gray-600)' }}>
                  Hi, {user.fullName?.split(' ')[0]}
                </span>
              </li>
              <li>
                <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className={isActive('/login')}>Login</Link></li>
              <li><Link to="/register" className="btn btn-primary btn-sm">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
