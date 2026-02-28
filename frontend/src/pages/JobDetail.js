import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobsAPI, applicationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ coverLetter: '', resumeUrl: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    jobsAPI.getById(id).then(res => {
      setJob(res.data);
    }).catch(() => navigate('/jobs')).finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    setMessage({ type: '', text: '' });
    try {
      await applicationsAPI.apply(id, form);
      setMessage({ type: 'success', text: '🎉 Application submitted successfully!' });
      setShowForm(false);
      setJob(prev => ({ ...prev, applicationCount: prev.applicationCount + 1 }));
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Application failed.' });
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;
  if (!job) return null;

  const isDeadlinePassed = job.deadline && new Date(job.deadline) < new Date();

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '900px' }}>
        <button className="btn btn-outline btn-sm mb-2" onClick={() => navigate(-1)}>← Back</button>

        {/* Header */}
        <div className="card mb-3">
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '.5rem' }}>{job.title}</h1>
                <div style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--primary)', marginBottom: '1rem' }}>
                  🏢 {job.company}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
                  <span className="badge badge-blue">📍 {job.location}</span>
                  <span className="badge badge-green">⏰ {job.jobType}</span>
                  {job.category && <span className="badge badge-purple">{job.category}</span>}
                  {job.salaryRange && <span className="badge badge-yellow">💰 {job.salaryRange}</span>}
                  {!job.isActive && <span className="badge badge-red">Closed</span>}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '.85rem', color: 'var(--gray-400)', marginBottom: '.5rem' }}>
                  📅 Posted {new Date(job.postedAt).toLocaleDateString()}
                </div>
                {job.deadline && (
                  <div style={{ fontSize: '.85rem', color: isDeadlinePassed ? 'var(--danger)' : 'var(--warning)' }}>
                    ⏳ Deadline: {new Date(job.deadline).toLocaleDateString()}
                    {isDeadlinePassed && ' (Expired)'}
                  </div>
                )}
                <div style={{ fontSize: '.85rem', color: 'var(--gray-400)', marginTop: '.5rem' }}>
                  👥 {job.applicationCount} applicant{job.applicationCount !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {user && !isAdmin() && job.isActive && !isDeadlinePassed && (
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                  {showForm ? '✕ Cancel' : '📩 Apply Now'}
                </button>
              )}
              {isAdmin() && (
                <button className="btn btn-outline" onClick={() => navigate(`/admin/jobs/edit/${job.id}`)}>
                  ✏️ Edit Job
                </button>
              )}
              {!user && (
                <button className="btn btn-primary" onClick={() => navigate('/login')}>
                  Login to Apply
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Alerts */}
        {message.text && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mb-3`}>
            {message.text}
          </div>
        )}

        {/* Apply Form */}
        {showForm && (
          <div className="card mb-3">
            <div className="card-header">
              <h3 className="card-title">📩 Submit Your Application</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleApply}>
                <div className="form-group">
                  <label className="form-label">Cover Letter *</label>
                  <textarea className="form-control" style={{ minHeight: '180px' }}
                    placeholder="Tell us about yourself and why you're a great fit for this role..."
                    value={form.coverLetter}
                    onChange={e => setForm({ ...form, coverLetter: e.target.value })}
                    required />
                </div>
                <div className="form-group">
                  <label className="form-label">Resume URL (optional)</label>
                  <input type="url" className="form-control"
                    placeholder="https://your-resume.com/resume.pdf"
                    value={form.resumeUrl}
                    onChange={e => setForm({ ...form, resumeUrl: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={applying}>
                  {applying ? 'Submitting...' : '🚀 Submit Application'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="grid grid-2" style={{ gap: '1.5rem' }}>
          <div>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">📋 Job Description</h3>
              </div>
              <div className="card-body">
                <p style={{ lineHeight: '1.8', color: 'var(--gray-600)', whiteSpace: 'pre-wrap' }}>{job.description}</p>
              </div>
            </div>
          </div>
          <div>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">✅ Requirements</h3>
              </div>
              <div className="card-body">
                <p style={{ lineHeight: '1.8', color: 'var(--gray-600)', whiteSpace: 'pre-wrap' }}>{job.requirements}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
