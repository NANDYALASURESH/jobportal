import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { applicationsAPI } from '../../services/api';

const statusColors = {
  Pending: 'badge-yellow',
  Reviewed: 'badge-blue',
  Accepted: 'badge-green',
  Rejected: 'badge-red',
};

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState({ status: '', search: '' });
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    applicationsAPI.getAllAdmin()
      .then(res => {
        setApplications(res.data);
        setFiltered(res.data);
      })
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...applications];
    if (filter.status) result = result.filter(a => a.status === filter.status);
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(a =>
        a.applicantName.toLowerCase().includes(q) ||
        a.jobTitle.toLowerCase().includes(q) ||
        a.applicantEmail.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [filter, applications]);

  const handleStatusChange = async (id, status) => {
    setUpdating(id);
    try {
      await applicationsAPI.updateStatus(id, status);
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch { alert('Status update failed.'); }
    finally { setUpdating(null); }
  };

  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;

  return (
    <div className="page">
      <div className="container">
        <div className="section-header mb-3">
          <h1 className="section-title">👥 All Applications</h1>
          <div style={{ display: 'flex', gap: '.75rem' }}>
            {['Pending', 'Reviewed', 'Accepted', 'Rejected'].map(s => (
              <span key={s} className={`badge ${statusColors[s]}`} style={{ fontSize: '.82rem' }}>
                {s}: {applications.filter(a => a.status === s).length}
              </span>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-3">
          <div className="card-body" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <input type="text" className="form-control"
                placeholder="Search applicant, job title..."
                value={filter.search}
                onChange={e => setFilter(p => ({ ...p, search: e.target.value }))} />
            </div>
            <div>
              <select className="form-control" value={filter.status}
                onChange={e => setFilter(p => ({ ...p, status: e.target.value }))}>
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <button className="btn btn-outline" onClick={() => setFilter({ status: '', search: '' })}>Clear</button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📭</div>
            <h3>No applications found</h3>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map(app => (
              <div key={app.id} className="card">
                <div className="card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '1rem' }}>{app.applicantName}</div>
                      <div style={{ color: 'var(--gray-400)', fontSize: '.85rem' }}>{app.applicantEmail}</div>
                      <div style={{ marginTop: '.25rem', color: 'var(--primary)', fontWeight: '600', fontSize: '.9rem' }}>
                        Applied for: {app.jobTitle} @ {app.company}
                      </div>
                      <div style={{ fontSize: '.8rem', color: 'var(--gray-400)', marginTop: '.25rem' }}>
                        📅 {new Date(app.appliedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span className={`badge ${statusColors[app.status]}`}>{app.status}</span>
                      <select
                        className="form-control"
                        style={{ width: 'auto', padding: '.4rem .8rem', fontSize: '.85rem' }}
                        value={app.status}
                        disabled={updating === app.id}
                        onChange={e => handleStatusChange(app.id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      <button className="btn btn-outline btn-sm"
                        onClick={() => setExpanded(expanded === app.id ? null : app.id)}>
                        {expanded === app.id ? '▲ Hide' : '▼ Cover Letter'}
                      </button>
                    </div>
                  </div>

                  {expanded === app.id && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--gray-50)', borderRadius: 'var(--radius)', fontSize: '.9rem', color: 'var(--gray-600)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                      <strong>Cover Letter:</strong>
                      <p style={{ marginTop: '.5rem' }}>{app.coverLetter}</p>
                      {app.resumeUrl && (
                        <div style={{ marginTop: '.75rem' }}>
                          <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                            📄 View Resume
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApplications;
