import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobsAPI } from '../services/api';

const Home = () => {
  const [recentJobs, setRecentJobs] = useState([]);
  const [stats, setStats] = useState({ jobs: 0, companies: 0 });
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    jobsAPI.getAll().then(res => {
      setRecentJobs(res.data.slice(0, 6));
      const companies = new Set(res.data.map(j => j.company)).size;
      setStats({ jobs: res.data.length, companies });
    }).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${search}`);
  };

  const categories = [
    { name: 'Technology', icon: '💻', count: 'IT & Software' },
    { name: 'Marketing', icon: '📊', count: 'Digital & Growth' },
    { name: 'Finance', icon: '💰', count: 'Accounting & Banking' },
    { name: 'Healthcare', icon: '🏥', count: 'Medical & Health' },
    { name: 'Design', icon: '🎨', count: 'UI/UX & Creative' },
    { name: 'Education', icon: '📚', count: 'Teaching & Training' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Find Your Dream Job Today 🚀</h1>
          <p>Thousands of jobs from top companies. Your next career move starts here.</p>
          <form onSubmit={handleSearch}>
            <div className="search-bar">
              <span style={{ padding: '.5rem', fontSize: '1.2rem' }}>🔍</span>
              <input
                type="text"
                placeholder="Job title, company, or keyword..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">Search Jobs</button>
            </div>
          </form>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '2rem', color: 'rgba(255,255,255,.8)', fontSize: '.9rem' }}>
            <span>✅ {stats.jobs}+ Active Jobs</span>
            <span>🏢 {stats.companies}+ Companies</span>
            <span>🌍 Remote & On-site</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'var(--white)', borderBottom: '1px solid var(--gray-200)' }}>
        <div className="container" style={{ padding: '2rem 1.5rem' }}>
          <div className="grid grid-4">
            {[
              { icon: '💼', label: 'Active Jobs', value: stats.jobs },
              { icon: '🏢', label: 'Companies', value: stats.companies },
              { icon: '👥', label: 'Job Seekers', value: '1,200+' },
              { icon: '✅', label: 'Placements', value: '850+' },
            ].map((s, i) => (
              <div key={i} className="stat-card text-center">
                <div style={{ fontSize: '2rem', marginBottom: '.25rem' }}>{s.icon}</div>
                <div className="stat-number">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="page" style={{ paddingBottom: '1rem' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Browse by Category</h2>
            <Link to="/jobs" className="btn btn-outline btn-sm">View All Jobs →</Link>
          </div>
          <div className="grid grid-3">
            {categories.map((cat, i) => (
              <Link to={`/jobs?category=${cat.name}`} key={i}
                style={{ textDecoration: 'none' }}
                onClick={() => {}}>
                <div className="job-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '2rem' }}>{cat.icon}</div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '1rem' }}>{cat.name}</div>
                    <div style={{ color: 'var(--gray-400)', fontSize: '.82rem' }}>{cat.count}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Jobs */}
      {recentJobs.length > 0 && (
        <section style={{ paddingBottom: '3rem' }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Recent Job Openings</h2>
              <Link to="/jobs" className="btn btn-outline btn-sm">See All →</Link>
            </div>
            <div className="grid grid-2">
              {recentJobs.map(job => (
                <div key={job.id} className="job-card" onClick={() => navigate(`/jobs/${job.id}`)}>
                  <div className="job-card-title">{job.title}</div>
                  <div className="job-card-company">{job.company}</div>
                  <div className="job-card-meta">
                    <span className="badge badge-blue">📍 {job.location}</span>
                    <span className="badge badge-green">⏰ {job.jobType}</span>
                    {job.salaryRange && <span className="badge badge-purple">💰 {job.salaryRange}</span>}
                  </div>
                  <p style={{ fontSize: '.88rem', color: 'var(--gray-600)', lineHeight: '1.5' }}>
                    {job.description.slice(0, 100)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '3rem 0', textAlign: 'center', color: '#fff' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>Ready to Find Your Next Role?</h2>
          <p style={{ opacity: '.9', marginBottom: '1.5rem' }}>Join thousands of professionals who found their dream jobs through JobPortal</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/register" className="btn" style={{ background: '#fff', color: 'var(--primary)' }}>Get Started Free</Link>
            <Link to="/jobs" className="btn btn-outline" style={{ borderColor: '#fff', color: '#fff' }}>Browse Jobs</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
