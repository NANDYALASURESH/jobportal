import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobsAPI } from '../../services/api';

const JobForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    title: '', company: '', location: '', description: '',
    requirements: '', jobType: 'Full-Time', category: '',
    salaryRange: '', deadline: '', isActive: true,
  });

  useEffect(() => {
    if (isEdit) {
      jobsAPI.getById(id).then(res => {
        const j = res.data;
        setForm({
          title: j.title, company: j.company, location: j.location,
          description: j.description, requirements: j.requirements,
          jobType: j.jobType, category: j.category, salaryRange: j.salaryRange || '',
          deadline: j.deadline ? j.deadline.split('T')[0] : '',
          isActive: j.isActive,
        });
      }).finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = { ...form, deadline: form.deadline || null };
      if (isEdit) {
        await jobsAPI.update(id, payload);
        setSuccess('Job updated successfully!');
      } else {
        await jobsAPI.create(payload);
        setSuccess('Job posted successfully!');
      }
      setTimeout(() => navigate('/admin/jobs'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '780px' }}>
        <button className="btn btn-outline btn-sm mb-2" onClick={() => navigate('/admin/jobs')}>← Back</button>
        <h1 className="section-title mb-3">{isEdit ? '✏️ Edit Job' : '➕ Post New Job'}</h1>

        {error && <div className="alert alert-error mb-2">⚠️ {error}</div>}
        {success && <div className="alert alert-success mb-2">✅ {success}</div>}

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Job Title *</label>
                  <input type="text" name="title" className="form-control"
                    placeholder="e.g. Senior React Developer" value={form.title} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Company *</label>
                  <input type="text" name="company" className="form-control"
                    placeholder="e.g. Tech Corp" value={form.company} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input type="text" name="location" className="form-control"
                    placeholder="e.g. New York, NY or Remote" value={form.location} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Job Type</label>
                  <select name="jobType" className="form-control" value={form.jobType} onChange={handleChange}>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Remote">Remote</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select name="category" className="form-control" value={form.category} onChange={handleChange}>
                    <option value="">Select Category</option>
                    {['Technology','Marketing','Finance','Healthcare','Design','Education','Sales','Engineering','HR','Other'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Salary Range</label>
                  <input type="text" name="salaryRange" className="form-control"
                    placeholder="e.g. $80K - $100K" value={form.salaryRange} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Application Deadline</label>
                  <input type="date" name="deadline" className="form-control"
                    value={form.deadline} onChange={handleChange} />
                </div>
                {isEdit && (
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '.75rem', paddingTop: '1.5rem' }}>
                    <input type="checkbox" name="isActive" id="isActive"
                      checked={form.isActive} onChange={handleChange}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                    <label htmlFor="isActive" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>
                      Job is Active (visible to users)
                    </label>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Job Description *</label>
                <textarea name="description" className="form-control" style={{ minHeight: '160px' }}
                  placeholder="Describe the role, responsibilities, and what a typical day looks like..."
                  value={form.description} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Requirements *</label>
                <textarea name="requirements" className="form-control" style={{ minHeight: '160px' }}
                  placeholder="List required skills, experience, education, and qualifications..."
                  value={form.requirements} onChange={handleChange} required />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : isEdit ? '💾 Update Job' : '🚀 Post Job'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/jobs')}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobForm;
