import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { jobsAPI } from '../services/api';

const JobTypeBadge = ({ type }) => {
  const colors = {
    'Full-Time': 'badge-green',
    'Part-Time': 'badge-yellow',
    'Remote': 'badge-blue',
    'Contract': 'badge-purple',
  };
  return <span className={`badge ${colors[type] || 'badge-gray'}`}>{type}</span>;
};

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    jobType: '',
    location: '',
  });

  const fetchJobs = async (f = filters) => {
    setLoading(true);
    try {
      const params = {};
      if (f.search) params.search = f.search;
      if (f.category) params.category = f.category;
      if (f.jobType) params.jobType = f.jobType;
      if (f.location) params.location = f.location;
      const res = await jobsAPI.getAll(params);
      setJobs(res.data);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleFilterChange = (e) => {
    const updated = { ...filters, [e.target.name]: e.target.value };
    setFilters(updated);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(filters);
  };

  const clearFilters = () => {
    const reset = { search: '', category: '', jobType: '', location: '' };
    setFilters(reset);
    fetchJobs(reset);
  };

  return (
    <div className="page">
      <div className="container">
        {/* Search & Filters */}
        <div className="card mb-3">
          <div className="card-body">
            <form onSubmit={handleSearch}>
              <div className="grid grid-4" style={{ marginBottom: '1rem' }}>
                <div style={{ gridColumn: '1 / 3' }}>
                  <label className="form-label">Search</label>
                  <input type="text" name="search" className="form-control"
                    placeholder="Job title, company, keyword..."
                    value={filters.search} onChange={handleFilterChange} />
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <select name="category" className="form-control" value={filters.category} onChange={handleFilterChange}>
                    <option value="">All Categories</option>
                    {['Technology','Marketing','Finance','Healthcare','Design','Education','Sales','Engineering','HR','Other'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Job Type</label>
                  <select name="jobType" className="form-control" value={filters.jobType} onChange={handleFilterChange}>
                    <option value="">All Types</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Remote">Remote</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '.75rem' }}>
                <button type="submit" className="btn btn-primary">🔍 Search</button>
                <button type="button" className="btn btn-outline" onClick={clearFilters}>✕ Clear</button>
              </div>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="section-header">
          <h2 className="section-title">
            {loading ? 'Loading...' : `${jobs.length} Job${jobs.length !== 1 ? 's' : ''} Found`}
          </h2>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner"></div></div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <h3>No jobs found</h3>
            <p>Try adjusting your search filters</p>
            <button className="btn btn-outline mt-2" onClick={clearFilters}>Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-2">
            {jobs.map(job => (
              <div key={job.id} className="job-card" onClick={() => navigate(`/jobs/${job.id}`)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.5rem' }}>
                  <div className="job-card-title">{job.title}</div>
                  <JobTypeBadge type={job.jobType} />
                </div>
                <div className="job-card-company">🏢 {job.company}</div>
                <div className="job-card-meta">
                  <span className="badge badge-gray">📍 {job.location}</span>
                  {job.salaryRange && <span className="badge badge-purple">💰 {job.salaryRange}</span>}
                  {job.category && <span className="badge badge-blue">{job.category}</span>}
                </div>
                <p style={{ fontSize: '.88rem', color: 'var(--gray-600)', lineHeight: '1.6', marginBottom: '1rem' }}>
                  {job.description.length > 120 ? job.description.slice(0, 120) + '...' : job.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '.8rem', color: 'var(--gray-400)' }}>
                    📅 {new Date(job.postedAt).toLocaleDateString()}
                  </span>
                  <span style={{ fontSize: '.8rem', color: 'var(--gray-400)' }}>
                    👥 {job.applicationCount} applicant{job.applicationCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsList;
