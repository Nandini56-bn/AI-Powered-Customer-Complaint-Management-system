import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Bot, 
  PlusCircle, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toggleUploadModal } from '../store/complaintSlice';
import { toggleChat } from '../store/chatSlice';

export default function Sidebar({ activeTab, setActiveTab }) {
  const dispatch = useDispatch();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'complaints', label: 'All Complaints', icon: FileText },
    { id: 'analytics', label: 'AI Analytics', icon: BarChart3 },
  ];

  return (
    <aside style={styles.sidebar}>
      {/* Brand Header */}
      <div style={styles.brandContainer}>
        <div style={styles.logoIcon}>
          <Sparkles size={22} color="#ffffff" />
        </div>
        <div>
          <h2 style={styles.brandTitle}>AIVOA</h2>
          <span style={styles.brandSubtitle}>AI Complaint Ops</span>
        </div>
      </div>

      {/* Action Button */}
      <div style={styles.actionSection}>
        <button 
          onClick={() => dispatch(toggleUploadModal(true))}
          className="btn btn-primary"
          style={styles.uploadBtn}
        >
          <PlusCircle size={18} />
          <span>Upload PDF / Email</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav style={styles.navMenu}>
        <div style={styles.sectionHeading}>MAIN NAVIGATION</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              }}
            >
              <Icon size={19} color={isActive ? '#6366f1' : '#94a3b8'} />
              <span>{item.label}</span>
              {isActive && <div style={styles.activeIndicator} />}
            </button>
          );
        })}

        <div style={{ ...styles.sectionHeading, marginTop: '1.5rem' }}>AI ASSISTANT</div>
        <button 
          onClick={() => dispatch(toggleChat(true))}
          style={styles.aiCopilotBtn}
        >
          <Bot size={19} color="#c084fc" />
          <span>Ask AI Assistant</span>
          <span style={styles.liveBadge}>LIVE</span>
        </button>
      </nav>

      {/* Footer Info */}
      <div style={styles.footer}>
        <div style={styles.statusBox}>
          <ShieldCheck size={16} color="#10b981" />
          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>LangGraph + Groq Active</span>
        </div>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: '260px',
    background: 'rgba(15, 23, 42, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRight: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem 1rem',
    zIndex: 40,
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    padding: '0.5rem 0.5rem 1.5rem 0.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)',
  },
  brandTitle: {
    fontSize: '1.25rem',
    letterSpacing: '0.5px',
    lineHeight: 1.1,
  },
  brandSubtitle: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    fontWeight: 500,
  },
  actionSection: {
    margin: '1.5rem 0 1rem 0',
  },
  uploadBtn: {
    width: '100%',
    padding: '0.8rem 1rem',
  },
  navMenu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    flex: 1,
  },
  sectionHeading: {
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '1px',
    color: '#64748b',
    padding: '0.5rem 0.75rem 0.25rem 0.75rem',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    background: 'transparent',
    border: 'none',
    color: '#94a3b8',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s ease',
    position: 'relative',
  },
  navItemActive: {
    background: 'rgba(99, 102, 241, 0.12)',
    color: '#ffffff',
    fontWeight: 600,
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: '20%',
    bottom: '20%',
    width: '3px',
    borderRadius: '0 4px 4px 0',
    background: '#6366f1',
    boxShadow: '0 0 10px #6366f1',
  },
  aiCopilotBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    background: 'rgba(139, 92, 246, 0.1)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    color: '#e9d5ff',
    fontSize: '0.88rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  liveBadge: {
    marginLeft: 'auto',
    fontSize: '0.65rem',
    background: 'rgba(16, 185, 129, 0.2)',
    color: '#34d399',
    padding: '0.15rem 0.4rem',
    borderRadius: '4px',
    fontWeight: 700,
  },
  footer: {
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  },
  statusBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 0.8rem',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.03)',
  },
};
