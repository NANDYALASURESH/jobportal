import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobsAPI } from '../../services/api';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  const fetchJobs = () => {
    jobsAPI.getAllAdmin()
      .then(res => setJobs(res.data))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  };

  useEffect(fetchJobs, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This will remove all applications.`)) return;
    setDeleting(id);
    try {
      await jobsAPI.delete(id);
      setJobs(prev => prev.filter(j => j.id !== id));
    } catch {
      alert('Delete failed.');
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleStatus = async (job) => {
    try {
      await jobsAPI.update(job.id, {
        title: job.title, company: job.company, location: job.location,
        description: job.description, requirements: job.requirements,
        jobType: job.jobType, category: job.category, salaryRange: job.salaryRange,
        deadline: job.deadline, isActive: !job.isActive
      });
      setJobs(prev => prev.map(j => j.id === job.id ? { ...j, isActive: !j.isActive } : j));
    } catch { alert('Update failed.'); }
  };

  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;

  return (
    <div className="page">
      <div className="container">
        <div className="section-header mb-3">
          <h1 className="section-title">💼 Manage Jobs</h1>
          <Link to="/admin/jobs/create" className="btn btn-primary">➕ Post New Job</Link>
        </div>

        {jobs.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📭</div>
            <h3>No jobs posted yet</h3>
            <Link to="/admin/jobs/create" className="btn btn-primary mt-2">Post Your First Job</Link>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Applications</th>
                  <th>Posted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{job.title}</div>
                      <div style={{ fontSize: '.8rem', color: 'var(--gray-400)' }}>📍 {job.location}</div>
                    </td>
                    <td>{job.company}</td>
                    <td><span className="badge badge-blue">{job.jobType}</span></td>
                    <td>{job.category || '—'}</td>
                    <td>
                      <button className="btn btn-outline btn-sm" onClick={() => navigate(`/admin/applications?jobId=${job.id}`)}>
                        👥 {job.applicationCount}
                      </button>
                    </td>
                    <td style={{ fontSize: '.85rem', color: 'var(--gray-400)' }}>
                      {new Date(job.postedAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        className={`badge ${job.isActive ? 'badge-green' : 'badge-red'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        onClick={() => handleToggleStatus(job)}
                        title="Click to toggle status"
                      >
                        {job.isActive ? '✅ Active' : '❌ Inactive'}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '.5rem' }}>
                        <button className="btn btn-outline btn-sm"
                          onClick={() => navigate(`/admin/jobs/edit/${job.id}`)}>✏️</button>
                        <button className="btn btn-danger btn-sm"
                          disabled={deleting === job.id}
                          onClick={() => handleDelete(job.id, job.title)}>
                          {deleting === job.id ? '...' : '🗑'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminJobs;
