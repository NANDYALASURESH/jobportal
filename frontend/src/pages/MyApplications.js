import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationsAPI } from '../services/api';

const statusColors = {
  Pending: 'badge-yellow',
  Reviewed: 'badge-blue',
  Accepted: 'badge-green',
  Rejected: 'badge-red',
};

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    applicationsAPI.getMyApplications()
      .then(res => setApplications(res.data))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;

  return (
    <div className="page">
      <div className="container">
        <div className="section-header mb-3">
          <h1 className="section-title">📋 My Applications</h1>
          <button className="btn btn-primary" onClick={() => navigate('/jobs')}>Browse More Jobs</button>
        </div>

        {applications.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📭</div>
            <h3>No applications yet</h3>
            <p>Start applying to jobs that match your skills</p>
            <button className="btn btn-primary mt-2" onClick={() => navigate('/jobs')}>
              Browse Jobs
            </button>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-4 mb-3">
              {['Pending', 'Reviewed', 'Accepted', 'Rejected'].map(status => (
                <div key={status} className="stat-card text-center">
                  <div className="stat-number">{applications.filter(a => a.status === status).length}</div>
                  <div className="stat-label">{status}</div>
                </div>
              ))}
            </div>

            <div className="grid" style={{ gap: '1rem' }}>
              {applications.map(app => (
                <div key={app.id} className="card">
                  <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <h3 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '.25rem' }}>{app.jobTitle}</h3>
                        <div style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '.5rem' }}>🏢 {app.company}</div>
                        <span className={`badge ${statusColors[app.status]}`}>
                          {app.status === 'Pending' ? '⏳' : app.status === 'Reviewed' ? '👁' : app.status === 'Accepted' ? '✅' : '❌'} {app.status}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '.85rem', color: 'var(--gray-400)' }}>
                          Applied: {new Date(app.appliedAt).toLocaleDateString()}
                        </div>
                        <button className="btn btn-outline btn-sm mt-1" onClick={() => navigate(`/jobs/${app.jobId}`)}>
                          View Job
                        </button>
                      </div>
                    </div>
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--gray-50)', borderRadius: 'var(--radius)', fontSize: '.88rem', color: 'var(--gray-600)' }}>
                      <strong>Cover Letter:</strong>
                      <p style={{ marginTop: '.25rem', lineHeight: '1.6' }}>
                        {app.coverLetter.length > 200 ? app.coverLetter.slice(0, 200) + '...' : app.coverLetter}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
