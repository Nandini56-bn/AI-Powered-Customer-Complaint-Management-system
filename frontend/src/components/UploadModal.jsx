import React, { useState } from 'react';
import { X, UploadCloud, FileText, Sparkles, AlertCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { extractComplaint, toggleUploadModal } from '../store/complaintSlice';

export default function UploadModal() {
  const dispatch = useDispatch();
  const { isUploadModalOpen, extracting, error } = useSelector((state) => state.complaints);
  const [activeTab, setActiveTab] = useState('file'); // 'file' or 'text'
  const [selectedFile, setSelectedFile] = useState(null);
  const [rawText, setRawText] = useState('');
  const [dragActive, setDragActive] = useState(false);

  if (!isUploadModalOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'file' && selectedFile) {
      dispatch(extractComplaint(selectedFile));
    } else if (activeTab === 'text' && rawText.trim()) {
      dispatch(extractComplaint(rawText));
    }
  };

  return (
    <div style={styles.overlay}>
      <div className="glass-panel animate-fade-in" style={styles.modal}>
        {/* Modal Header */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={styles.iconGlow}>
              <Sparkles size={20} color="#a855f7" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem' }}>AI Complaint Extraction</h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Upload PDF / Email document or paste text for AI auto-extraction
              </p>
            </div>
          </div>
          <button 
            onClick={() => dispatch(toggleUploadModal(false))} 
            style={styles.closeBtn}
            disabled={extracting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selector */}
        <div style={styles.tabContainer}>
          <button
            onClick={() => setActiveTab('file')}
            style={{ ...styles.tabBtn, ...(activeTab === 'file' ? styles.tabActive : {}) }}
          >
            <UploadCloud size={16} />
            <span>Document Upload (PDF / TXT)</span>
          </button>
          <button
            onClick={() => setActiveTab('text')}
            style={{ ...styles.tabBtn, ...(activeTab === 'text' ? styles.tabActive : {}) }}
          >
            <FileText size={16} />
            <span>Paste Email / Text</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={styles.errorBanner}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Overlay State */}
        {extracting ? (
          <div style={styles.loadingContainer}>
            <div className="spinner" style={{ width: '48px', height: '48px', borderWidth: '4px' }} />
            <h4 style={{ marginTop: '1.25rem', fontSize: '1.1rem' }} className="text-gradient">
              Analyzing Document with LangGraph & Groq AI...
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.4rem', textAlign: 'center' }}>
              Extracting customer information, complaint summary, urgency level, and suggested resolution...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            {activeTab === 'file' ? (
              <div
                style={{
                  ...styles.dropzone,
                  ...(dragActive ? styles.dropzoneActive : {}),
                }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf,.txt,.doc,.docx"
                  id="file-upload"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="file-upload" style={styles.dropzoneLabel}>
                  <div style={styles.dropzoneIcon}>
                    <UploadCloud size={32} color="#6366f1" />
                  </div>
                  {selectedFile ? (
                    <div>
                      <p style={{ fontWeight: 600, color: '#34d399' }}>{selectedFile.name}</p>
                      <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                        {(selectedFile.size / 1024).toFixed(1)} KB - Click or drag to change
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontWeight: 600 }}>Drag & drop your PDF complaint here</p>
                      <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                        Supports PDF, TXT files up to 10MB
                      </p>
                    </div>
                  )}
                </label>
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">Raw Email / Customer Message Text</label>
                <textarea
                  className="form-textarea"
                  rows={8}
                  placeholder="Paste customer complaint email content here... (e.g. Dear Support, I was overcharged $150 on my recent subscription billing. Ticket request ID is urgent...)"
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                />
              </div>
            )}

            {/* Submit Actions */}
            <div style={styles.actions}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => dispatch(toggleUploadModal(false))}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={activeTab === 'file' ? !selectedFile : !rawText.trim()}
              >
                <Sparkles size={16} />
                <span>Extract with AI</span>
              </button>
            </div>
          </form>
        )}
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
    background: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '1rem',
  },
  modal: {
    width: '100%',
    maxWidth: '560px',
    padding: '1.75rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.25rem',
  },
  iconGlow: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    background: 'rgba(168, 85, 247, 0.15)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: '0.4rem',
    borderRadius: '8px',
  },
  tabContainer: {
    display: 'flex',
    gap: '0.5rem',
    background: 'rgba(15, 23, 42, 0.6)',
    padding: '0.3rem',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    marginBottom: '1.25rem',
  },
  tabBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.6rem',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    color: '#94a3b8',
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tabActive: {
    background: '#6366f1',
    color: '#ffffff',
    boxShadow: '0 2px 10px rgba(99, 102, 241, 0.4)',
  },
  dropzone: {
    border: '2px dashed rgba(99, 102, 241, 0.3)',
    borderRadius: '14px',
    padding: '2.5rem 1.5rem',
    textAlign: 'center',
    background: 'rgba(99, 102, 241, 0.03)',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  dropzoneActive: {
    borderColor: '#6366f1',
    background: 'rgba(99, 102, 241, 0.1)',
  },
  dropzoneLabel: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.85rem',
  },
  dropzoneIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'rgba(99, 102, 241, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    padding: '3rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#fca5a5',
    fontSize: '0.85rem',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    marginTop: '0.5rem',
  },
};
