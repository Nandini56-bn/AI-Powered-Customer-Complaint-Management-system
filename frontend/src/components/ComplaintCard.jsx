import React from 'react';
import { Sparkles, Calendar, User, ArrowRight, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSelectedComplaint } from '../store/complaintSlice';

export default function ComplaintCard({ complaint }) {
  const dispatch = useDispatch();

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return 'priority-urgent';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': default: return 'priority-low';
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'badge-pending';
      case 'in_progress':
      case 'in progress': return 'badge-progress';
      case 'resolved': return 'badge-resolved';
      case 'escalated': return 'badge-escalated';
      default: return 'badge-pending';
    }
  };

  return (
    <div 
      className="glass-panel glass-panel-interactive"
      style={styles.card}
      onClick={() => dispatch(setSelectedComplaint(complaint))}
    >
      {/* Top Metadata Row */}
      <div style={styles.topRow}>
        <div style={styles.ticketBadge}>
          <span>{complaint.ticket_id}</span>
        </div>
        <div style={styles.badgeGroup}>
          <span className={`badge ${getPriorityClass(complaint.priority)}`}>
            {complaint.priority}
          </span>
          <span className={`badge ${getStatusClass(complaint.status)}`}>
            {complaint.status}
          </span>
        </div>
      </div>

      {/* Title / Subject */}
      <h4 style={styles.subject}>{complaint.subject}</h4>

      {/* AI Summary Snippet */}
      <p style={styles.summary}>
        {complaint.summary || complaint.description?.substring(0, 120) + '...'}
      </p>

      {/* Tags */}
      {complaint.tags && (
        <div style={styles.tagContainer}>
          {complaint.tags.split(',').map((tag, idx) => (
            <span key={idx} style={styles.tag}>
              #{tag.trim()}
            </span>
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div style={styles.footer}>
        <div style={styles.userInfo}>
          <User size={14} color="#94a3b8" />
          <span>{complaint.customer_name}</span>
        </div>
        <div style={styles.dateInfo}>
          <Calendar size={13} color="#64748b" />
          <span>{new Date(complaint.created_at || Date.now()).toLocaleDateString()}</span>
        </div>
        <button style={styles.viewBtn}>
          <span>View</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
    cursor: 'pointer',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ticketBadge: {
    fontSize: '0.78rem',
    fontWeight: 700,
    fontFamily: 'monospace',
    color: '#a5b4fc',
    background: 'rgba(99, 102, 241, 0.1)',
    padding: '0.2rem 0.6rem',
    borderRadius: '6px',
    border: '1px solid rgba(99, 102, 241, 0.2)',
  },
  badgeGroup: {
    display: 'flex',
    gap: '0.4rem',
  },
  subject: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#ffffff',
    lineHeight: 1.3,
  },
  summary: {
    fontSize: '0.83rem',
    color: '#94a3b8',
    lineHeight: 1.45,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  tagContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.35rem',
  },
  tag: {
    fontSize: '0.72rem',
    color: '#c084fc',
    background: 'rgba(192, 132, 252, 0.1)',
    padding: '0.15rem 0.5rem',
    borderRadius: '4px',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '0.75rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    marginTop: 'auto',
    fontSize: '0.78rem',
    color: '#94a3b8',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontWeight: 500,
  },
  dateInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
  },
  viewBtn: {
    background: 'transparent',
    border: 'none',
    color: '#6366f1',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    cursor: 'pointer',
  },
};
