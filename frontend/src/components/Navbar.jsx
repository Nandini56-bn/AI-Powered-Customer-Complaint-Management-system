import React from 'react';
import { Search, Bot, Plus, Bell, RefreshCw } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, toggleUploadModal, fetchComplaints, fetchStats } from '../store/complaintSlice';
import { toggleChat } from '../store/chatSlice';

export default function Navbar({ activeTabTitle }) {
  const dispatch = useDispatch();
  const { filters, loading } = useSelector((state) => state.complaints);

  const handleSearchChange = (e) => {
    dispatch(setFilters({ search: e.target.value }));
    dispatch(fetchComplaints({ ...filters, search: e.target.value }));
  };

  const handleRefresh = () => {
    dispatch(fetchComplaints(filters));
    dispatch(fetchStats());
  };

  return (
    <header style={styles.header}>
      {/* Page Title */}
      <div>
        <h1 style={styles.title}>{activeTabTitle}</h1>
        <p style={styles.subtitle}>AI-Powered Complaint Processing & Resolution System</p>
      </div>

      {/* Right Controls */}
      <div style={styles.controls}>
        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <Search size={17} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search tickets, names, topics..."
            value={filters.search}
            onChange={handleSearchChange}
            style={styles.searchInput}
          />
        </div>

        {/* Refresh button */}
        <button 
          onClick={handleRefresh} 
          className="btn btn-secondary" 
          title="Refresh Data"
          style={{ padding: '0.6rem' }}
        >
          <RefreshCw size={17} className={loading ? 'spinner' : ''} />
        </button>

        {/* Quick New Upload */}
        <button
          onClick={() => dispatch(toggleUploadModal(true))}
          className="btn btn-primary"
        >
          <Plus size={18} />
          <span>New Complaint</span>
        </button>

        {/* AI Assistant Drawer Trigger */}
        <button
          onClick={() => dispatch(toggleChat(true))}
          style={styles.aiChatBadgeBtn}
          title="Open AI Assistant"
        >
          <Bot size={20} color="#a855f7" />
          <span style={styles.onlineDot} />
        </button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    padding: '1.25rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    background: 'rgba(11, 15, 25, 0.8)',
    backdropFilter: 'blur(12px)',
    position: 'sticky',
    top: 0,
    zIndex: 30,
  },
  title: {
    fontSize: '1.5rem',
    letterSpacing: '-0.5px',
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    marginTop: '0.15rem',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
  },
  searchContainer: {
    position: 'relative',
    width: '260px',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#64748b',
  },
  searchInput: {
    width: '100%',
    padding: '0.55rem 0.85rem 0.55rem 2.3rem',
    borderRadius: '10px',
    background: 'rgba(15, 23, 42, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    fontSize: '0.85rem',
    outline: 'none',
  },
  aiChatBadgeBtn: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    background: 'rgba(168, 85, 247, 0.15)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.2s ease',
  },
  onlineDot: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#10b981',
    boxShadow: '0 0 6px #10b981',
  },
};
