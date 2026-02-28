import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI, applicationsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ jobs: 0, active: 0, applications: 0, pending: 0 });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      jobsAPI.getAllAdmin(),
      applicationsAPI.getAllAdmin(),
    ]).then(([jobsRes, appsRes]) => {
      const jobs = jobsRes.data;
      const apps = appsRes.data;
      setStats({
        jobs: jobs.length,
        active: jobs.filter(j => j.isActive).length,
        applications: apps.length,
        pending: apps.filter(a => a.status === 'Pending').length,
      });
      setRecentJobs(jobs.slice(0, 5));
      setRecentApps(apps.slice(0, 5));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;

  return (
    <div className="page">
      <div className="container">
        {/* Welcome */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900' }}>
            👋 Welcome, {user?.fullName}!
          </h1>
          <p style={{ color: 'var(--gray-400)' }}>Here's your admin overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-4 mb-3">
          {[
            { label: 'Total Jobs', value: stats.jobs, icon: '💼', color: 'var(--primary)', link: '/admin/jobs' },
            { label: 'Active Jobs', value: stats.active, icon: '✅', color: 'var(--success)', link: '/admin/jobs' },
            { label: 'Total Applications', value: stats.applications, icon: '📋', color: 'var(--secondary)', link: '/admin/applications' },
            { label: 'Pending Review', value: stats.pending, icon: '⏳', color: 'var(--warning)', link: '/admin/applications' },
          ].map((s, i) => (
            <Link to={s.link} key={i} style={{ textDecoration: 'none' }}>
              <div className="stat-card" style={{ cursor: 'pointer', transition: 'transform .2s', ':hover': { transform: 'translateY(-2px)' } }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
                  <span style={{ fontSize: '1.8rem' }}>{s.icon}</span>
                  <span style={{ fontSize: '.75rem', color: s.color, fontWeight: '700', textTransform: 'uppercase' }}>View All</span>
                </div>
                <div className="stat-number" style={{ color: s.color }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="card mb-3">
          <div className="card-header">
            <h3 className="card-title">⚡ Quick Actions</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/admin/jobs/create" className="btn btn-primary">➕ Post New Job</Link>
              <Link to="/admin/jobs" className="btn btn-outline">📋 Manage Jobs</Link>
              <Link to="/admin/applications" className="btn btn-outline">👥 Review Applications</Link>
            </div>
          </div>
        </div>

        <div className="grid grid-2">
          {/* Recent Jobs */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Jobs</h3>
              <Link to="/admin/jobs" className="btn btn-outline btn-sm">View All</Link>
            </div>
            <div>
              {recentJobs.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem' }}>No jobs yet</div>
              ) : recentJobs.map(job => (
                <div key={job.id} style={{ padding: '1rem', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '.95rem' }}>{job.title}</div>
                    <div style={{ fontSize: '.82rem', color: 'var(--gray-400)' }}>{job.company} • {job.applicationCount} apps</div>
                  </div>
                  <span className={`badge ${job.isActive ? 'badge-green' : 'badge-red'}`}>
                    {job.isActive ? 'Active' : 'Closed'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Applications */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Applications</h3>
              <Link to="/admin/applications" className="btn btn-outline btn-sm">View All</Link>
            </div>
            <div>
              {recentApps.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem' }}>No applications yet</div>
              ) : recentApps.map(app => (
                <div key={app.id} style={{ padding: '1rem', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '.95rem' }}>{app.applicantName}</div>
                    <div style={{ fontSize: '.82rem', color: 'var(--gray-400)' }}>{app.jobTitle}</div>
                  </div>
                  <span className={`badge ${app.status === 'Pending' ? 'badge-yellow' : app.status === 'Accepted' ? 'badge-green' : app.status === 'Rejected' ? 'badge-red' : 'badge-blue'}`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
