import React, { useEffect } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  PlusCircle,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComplaints, fetchStats, toggleUploadModal } from '../store/complaintSlice';
import StatCard from '../components/StatCard';
import ComplaintCard from '../components/ComplaintCard';

export default function Dashboard({ onNavigate }) {
  const dispatch = useDispatch();
  const { items, stats, loading } = useSelector((state) => state.complaints);

  useEffect(() => {
    dispatch(fetchComplaints());
    dispatch(fetchStats());
  }, [dispatch]);

  const recentComplaints = items.slice(0, 6);

  return (
    <div style={styles.container}>
      {/* Hero Header Banner */}
      <div className="glass-panel" style={styles.heroBanner}>
        <div style={{ flex: 1 }}>
          <div style={styles.aiTag}>
            <Sparkles size={14} color="#a855f7" />
            <span>AI Automated Complaint System</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', marginTop: '0.5rem' }}>
            Transform Unstructured Customer Feedback into Actionable Tickets
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.4rem', maxWidth: '600px' }}>
            Upload complaint PDFs or raw email text. LangGraph & Groq API extract sentiment, urgency, customer details, and resolution plans automatically.
          </p>
          <button 
            onClick={() => dispatch(toggleUploadModal(true))} 
            className="btn btn-primary"
            style={{ marginTop: '1.25rem' }}
          >
            <PlusCircle size={18} />
            <span>Extract Complaint from PDF / Email</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div style={styles.statsGrid}>
        <StatCard 
          title="Total Complaints" 
          value={stats.total || 0} 
          icon={FileText} 
          color="indigo" 
          trend="+12%"
        />
        <StatCard 
          title="Pending Review" 
          value={stats.pending || 0} 
          icon={Clock} 
          color="amber"
        />
        <StatCard 
          title="In Progress" 
          value={stats.in_progress || 0} 
          icon={TrendingUp} 
          color="blue"
        />
        <StatCard 
          title="Resolved" 
          value={stats.resolved || 0} 
          icon={CheckCircle2} 
          color="emerald" 
          trend="+18%"
        />
        <StatCard 
          title="Urgent Priority" 
          value={stats.urgent || 0} 
          icon={AlertTriangle} 
          color="rose"
        />
      </div>

      {/* Recent Complaints Grid */}
      <div style={{ marginTop: '2rem' }}>
        <div style={styles.sectionHeader}>
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>Recent Complaints Feed</h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Latest AI parsed customer tickets</p>
          </div>
          <button 
            onClick={() => onNavigate('complaints')} 
            className="btn btn-secondary btn-sm"
          >
            <span>View All Tickets</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {loading && items.length === 0 ? (
          <div style={styles.emptyState}>
            <div className="spinner" />
            <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Loading customer complaints...</p>
          </div>
        ) : recentComplaints.length === 0 ? (
          <div className="glass-panel" style={styles.emptyState}>
            <FileText size={42} color="#64748b" />
            <h4 style={{ marginTop: '0.85rem' }}>No complaints found in database</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.3rem' }}>
              Click "Extract Complaint from PDF / Email" above to process your first customer complaint!
            </p>
            <button 
              onClick={() => dispatch(toggleUploadModal(true))} 
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
            >
              <PlusCircle size={16} />
              <span>Process First Complaint</span>
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {recentComplaints.map((item) => (
              <ComplaintCard key={item.id || item.ticket_id} complaint={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  heroBanner: {
    padding: '2rem',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.08) 50%, rgba(15, 23, 42, 0.4) 100%)',
    border: '1px solid rgba(99, 102, 241, 0.25)',
  },
  aiTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    background: 'rgba(168, 85, 247, 0.15)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    color: '#e9d5ff',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.25rem',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.25rem',
  },
  emptyState: {
    padding: '3rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
