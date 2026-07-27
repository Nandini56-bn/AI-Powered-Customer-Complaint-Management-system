import React, { useState } from 'react';
import { X, Sparkles, User, Mail, Calendar, Trash2, Bot, CheckCircle, Clock, AlertOctagon, Send } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedComplaint, updateComplaintStatus, deleteComplaint } from '../store/complaintSlice';
import { toggleChat, addMessage } from '../store/chatSlice';

export default function ComplaintDetailModal() {
  const dispatch = useDispatch();
  const { selectedComplaint } = useSelector((state) => state.complaints);
  const [updating, setUpdating] = useState(false);

  if (!selectedComplaint) return null;

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    await dispatch(updateComplaintStatus({ id: selectedComplaint.id, statusData: { status: newStatus } }));
    setUpdating(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      await dispatch(deleteComplaint(selectedComplaint.id));
      dispatch(setSelectedComplaint(null));
    }
  };

  const handleOpenAIChat = () => {
    dispatch(toggleChat(true));
    dispatch(addMessage({
      sender: 'user',
      text: `Draft a professional resolution email for Complaint ${selectedComplaint.ticket_id}: "${selectedComplaint.subject}". Customer: ${selectedComplaint.customer_name}.`,
    }));
  };

  return (
    <div style={styles.overlay}>
      <div className="glass-panel animate-fade-in" style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
              <span style={styles.ticketId}>{selectedComplaint.ticket_id}</span>
              <span className={`badge priority-${selectedComplaint.priority?.toLowerCase()}`}>
                {selectedComplaint.priority} Priority
              </span>
              <span className={`badge badge-${selectedComplaint.status?.toLowerCase().replace(' ', '_')}`}>
                {selectedComplaint.status}
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem' }}>{selectedComplaint.subject}</h2>
          </div>
          <button 
            onClick={() => dispatch(setSelectedComplaint(null))} 
            style={styles.closeBtn}
          >
            <X size={22} />
          </button>
        </div>

        {/* Content Body */}
        <div style={styles.content}>
          {/* Main Info */}
          <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Customer Details Box */}
            <div style={styles.infoCard}>
              <div style={styles.infoRow}>
                <User size={16} color="#6366f1" />
                <span style={{ fontWeight: 600 }}>{selectedComplaint.customer_name}</span>
              </div>
              <div style={styles.infoRow}>
                <Mail size={16} color="#6366f1" />
                <span style={{ color: '#94a3b8' }}>{selectedComplaint.customer_email}</span>
              </div>
              <div style={styles.infoRow}>
                <Calendar size={16} color="#6366f1" />
                <span style={{ color: '#94a3b8' }}>{new Date(selectedComplaint.created_at || Date.now()).toLocaleString()}</span>
              </div>
            </div>

            {/* Detailed Description */}
            <div>
              <h4 style={styles.sectionTitle}>Complaint Description</h4>
              <div style={styles.textBox}>
                {selectedComplaint.description}
              </div>
            </div>

            {/* AI Executive Summary */}
            <div>
              <h4 style={{ ...styles.sectionTitle, color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={16} color="#a5b4fc" /> AI Executive Summary
              </h4>
              <div style={{ ...styles.textBox, background: 'rgba(99, 102, 241, 0.08)', borderColor: 'rgba(99, 102, 241, 0.25)' }}>
                {selectedComplaint.summary || 'No AI summary generated.'}
              </div>
            </div>

            {/* AI Suggested Action */}
            <div>
              <h4 style={{ ...styles.sectionTitle, color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={16} color="#34d399" /> AI Suggested Resolution Plan
              </h4>
              <div style={{ ...styles.textBox, background: 'rgba(16, 185, 129, 0.08)', borderColor: 'rgba(16, 185, 129, 0.25)' }}>
                {selectedComplaint.suggested_action || 'Review complaint details and update status.'}
              </div>
            </div>
          </div>

          {/* Side Controls */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Status Change Control */}
            <div style={styles.controlBox}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>Update Status</h4>
              <div style={styles.statusButtons}>
                {['Pending', 'In Progress', 'Resolved', 'Escalated'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={updating}
                    style={{
                      ...styles.statusBtn,
                      ...(selectedComplaint.status === status ? styles.statusBtnActive : {}),
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Copilot Draft Action */}
            <div style={styles.aiActionBox}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Bot size={18} color="#c084fc" />
                <span style={{ fontWeight: 600, color: '#e9d5ff', fontSize: '0.9rem' }}>AI Copilot</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.85rem' }}>
                Generate customer reply emails, escalation notes, or resolution proposals.
              </p>
              <button onClick={handleOpenAIChat} className="btn btn-primary" style={{ width: '100%', fontSize: '0.82rem' }}>
                <Sparkles size={15} />
                <span>Draft Email with AI</span>
              </button>
            </div>

            {/* Delete Option */}
            <button onClick={handleDelete} className="btn btn-danger" style={{ marginTop: 'auto' }}>
              <Trash2 size={16} />
              <span>Delete Ticket</span>
            </button>
          </div>
        </div>
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
    background: 'rgba(0, 0, 0, 0.82)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '1.5rem',
  },
  modal: {
    width: '100%',
    maxWidth: '900px',
    padding: '2rem',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  ticketId: {
    fontFamily: 'monospace',
    fontWeight: 700,
    color: '#a5b4fc',
    background: 'rgba(99, 102, 241, 0.15)',
    padding: '0.2rem 0.6rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
  },
  content: {
    display: 'flex',
    gap: '1.5rem',
  },
  infoCard: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.25rem',
    padding: '1rem 1.25rem',
    borderRadius: '12px',
    background: 'rgba(15, 23, 42, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
  },
  sectionTitle: {
    fontSize: '0.9rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
    color: '#94a3b8',
  },
  textBox: {
    padding: '1rem',
    borderRadius: '10px',
    background: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    fontSize: '0.9rem',
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap',
  },
  controlBox: {
    padding: '1.25rem',
    borderRadius: '14px',
    background: 'rgba(15, 23, 42, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  statusButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  statusBtn: {
    padding: '0.55rem 0.85rem',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    background: 'rgba(255, 255, 255, 0.02)',
    color: '#94a3b8',
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s ease',
  },
  statusBtnActive: {
    background: 'rgba(99, 102, 241, 0.2)',
    borderColor: '#6366f1',
    color: '#ffffff',
  },
  aiActionBox: {
    padding: '1.25rem',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(99, 102, 241, 0.05) 100%)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
  },
};
