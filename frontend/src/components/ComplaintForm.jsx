import React, { useState, useEffect } from 'react';
import { X, Save, Sparkles, User, Mail, Tag, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { saveComplaint, toggleFormModal } from '../store/complaintSlice';

export default function ComplaintForm() {
  const dispatch = useDispatch();
  const { extractedDraft, isFormModalOpen } = useSelector((state) => state.complaints);

  const [formData, setFormData] = useState({
    ticket_id: '',
    customer_name: '',
    customer_email: '',
    category: 'Technical',
    priority: 'Medium',
    status: 'Pending',
    subject: '',
    description: '',
    summary: '',
    sentiment: 'Neutral',
    suggested_action: '',
    tags: '',
  });

  useEffect(() => {
    if (extractedDraft) {
      setFormData({
        ticket_id: extractedDraft.ticket_id || `CMP-${Math.floor(1000 + Math.random() * 9000)}`,
        customer_name: extractedDraft.customer_name || '',
        customer_email: extractedDraft.customer_email || '',
        category: extractedDraft.category || 'Technical',
        priority: extractedDraft.priority || 'Medium',
        status: 'Pending',
        subject: extractedDraft.subject || '',
        description: extractedDraft.description || '',
        summary: extractedDraft.summary || '',
        sentiment: extractedDraft.sentiment || 'Neutral',
        suggested_action: extractedDraft.suggested_action || '',
        tags: Array.isArray(extractedDraft.tags) ? extractedDraft.tags.join(', ') : extractedDraft.tags || '',
      });
    }
  }, [extractedDraft]);

  if (!isFormModalOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(saveComplaint(formData));
  };

  return (
    <div style={styles.overlay}>
      <div className="glass-panel animate-fade-in" style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={styles.aiBadge}>
              <Sparkles size={20} color="#6366f1" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem' }}>AI Auto-Filled Complaint Form</h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Review and edit extracted fields before saving to MySQL
              </p>
            </div>
          </div>
          <button 
            onClick={() => dispatch(toggleFormModal(false))} 
            style={styles.closeBtn}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={styles.formGrid}>
          {/* Row 1: Ticket ID & Customer Name */}
          <div style={styles.row}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Ticket ID</label>
              <input
                type="text"
                name="ticket_id"
                className="form-input"
                value={formData.ticket_id}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Customer Name</label>
              <input
                type="text"
                name="customer_name"
                className="form-input"
                value={formData.customer_name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                required
              />
            </div>
          </div>

          {/* Row 2: Email & Category */}
          <div style={styles.row}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Customer Email</label>
              <input
                type="email"
                name="customer_email"
                className="form-input"
                value={formData.customer_email}
                onChange={handleChange}
                placeholder="customer@example.com"
                required
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Billing">Billing & Payments</option>
                <option value="Technical">Technical Support</option>
                <option value="Product Quality">Product Quality</option>
                <option value="Delivery">Delivery & Logistics</option>
                <option value="Service">Customer Service</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Row 3: Priority & Sentiment */}
          <div style={styles.row}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Urgency / Priority (AI Extracted)</label>
              <select
                name="priority"
                className="form-select"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
                <option value="Urgent">Urgent / Critical</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">AI Sentiment Analysis</label>
              <select
                name="sentiment"
                className="form-select"
                value={formData.sentiment}
                onChange={handleChange}
              >
                <option value="Positive">Positive</option>
                <option value="Neutral">Neutral</option>
                <option value="Negative">Negative / Frustrated</option>
              </select>
            </div>
          </div>

          {/* Subject */}
          <div className="form-group">
            <label className="form-label">Complaint Subject</label>
            <input
              type="text"
              name="subject"
              className="form-input"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Brief summary line..."
              required
            />
          </div>

          {/* Full Description */}
          <div className="form-group">
            <label className="form-label">Detailed Complaint Text</label>
            <textarea
              name="description"
              className="form-textarea"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* AI Executive Summary */}
          <div className="form-group">
            <label className="form-label" style={{ color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={14} /> AI Executive Summary
            </label>
            <textarea
              name="summary"
              className="form-textarea"
              rows={2}
              value={formData.summary}
              onChange={handleChange}
              style={{ background: 'rgba(99, 102, 241, 0.06)', borderColor: 'rgba(99, 102, 241, 0.25)' }}
            />
          </div>

          {/* AI Suggested Resolution */}
          <div className="form-group">
            <label className="form-label" style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={14} /> AI Suggested Action Plan
            </label>
            <textarea
              name="suggested_action"
              className="form-textarea"
              rows={2}
              value={formData.suggested_action}
              onChange={handleChange}
              style={{ background: 'rgba(16, 185, 129, 0.06)', borderColor: 'rgba(16, 185, 129, 0.25)' }}
            />
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              className="form-input"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g. billing-error, urgent, refund-requested"
            />
          </div>

          {/* Form Actions */}
          <div style={styles.actions}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => dispatch(toggleFormModal(false))}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              <span>Save to MySQL Database</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '1.5rem',
    overflowY: 'auto',
  },
  modal: {
    width: '100%',
    maxWidth: '720px',
    padding: '2rem',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  aiBadge: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    background: 'rgba(99, 102, 241, 0.15)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
  },
  formGrid: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    gap: '1rem',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  },
};
