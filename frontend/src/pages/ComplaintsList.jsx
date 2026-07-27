import React, { useEffect, useState } from 'react';
import { Search, Filter, Grid, List, Plus, RefreshCw, FileText } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComplaints, setFilters, toggleUploadModal, setSelectedComplaint } from '../store/complaintSlice';
import ComplaintCard from '../components/ComplaintCard';

export default function ComplaintsList() {
  const dispatch = useDispatch();
  const { items, filters, loading } = useSelector((state) => state.complaints);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  useEffect(() => {
    dispatch(fetchComplaints(filters));
  }, [dispatch]);

  const handleStatusFilter = (status) => {
    const newFilters = { ...filters, status };
    dispatch(setFilters({ status }));
    dispatch(fetchComplaints(newFilters));
  };

  const handleCategoryFilter = (e) => {
    const category = e.target.value;
    const newFilters = { ...filters, category };
    dispatch(setFilters({ category }));
    dispatch(fetchComplaints(newFilters));
  };

  const handlePriorityFilter = (e) => {
    const priority = e.target.value;
    const newFilters = { ...filters, priority };
    dispatch(setFilters({ priority }));
    dispatch(fetchComplaints(newFilters));
  };

  return (
    <div style={styles.container}>
      {/* Top Filter Bar */}
      <div className="glass-panel" style={styles.filterBar}>
        {/* Status Tabs */}
        <div style={styles.statusTabs}>
          {['all', 'Pending', 'In Progress', 'Resolved', 'Escalated'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleStatusFilter(tab)}
              style={{
                ...styles.tabBtn,
                ...(filters.status === tab ? styles.tabBtnActive : {}),
              }}
            >
              {tab === 'all' ? 'All Complaints' : tab}
            </button>
          ))}
        </div>

        {/* Dropdown Filters & Controls */}
        <div style={styles.controlsGroup}>
          <select 
            className="form-select" 
            value={filters.category} 
            onChange={handleCategoryFilter}
            style={{ width: '160px', padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
          >
            <option value="all">All Categories</option>
            <option value="Billing">Billing</option>
            <option value="Technical">Technical</option>
            <option value="Product Quality">Product Quality</option>
            <option value="Delivery">Delivery</option>
            <option value="Service">Service</option>
          </select>

          <select 
            className="form-select" 
            value={filters.priority} 
            onChange={handlePriorityFilter}
            style={{ width: '150px', padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* View Mode Toggle */}
          <div style={styles.viewToggle}>
            <button
              onClick={() => setViewMode('grid')}
              style={{ ...styles.toggleBtn, ...(viewMode === 'grid' ? styles.toggleActive : {}) }}
              title="Grid View"
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{ ...styles.toggleBtn, ...(viewMode === 'table' ? styles.toggleActive : {}) }}
              title="Table View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div style={styles.centerState}>
          <div className="spinner" />
          <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Fetching tickets from database...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="glass-panel" style={styles.centerState}>
          <FileText size={42} color="#64748b" />
          <h3 style={{ marginTop: '1rem' }}>No tickets match your filters</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Try adjusting search terms or upload a new complaint PDF.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={styles.grid}>
          {items.map((complaint) => (
            <ComplaintCard key={complaint.id || complaint.ticket_id} complaint={complaint} />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="glass-panel" style={{ padding: '0.5rem', overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th>Ticket ID</th>
                <th>Subject</th>
                <th>Customer</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr 
                  key={row.id || row.ticket_id} 
                  style={styles.tableRow}
                  onClick={() => dispatch(setSelectedComplaint(row))}
                >
                  <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#a5b4fc' }}>
                    {row.ticket_id}
                  </td>
                  <td style={{ fontWeight: 600, color: '#ffffff' }}>{row.subject}</td>
                  <td>{row.customer_name}</td>
                  <td>{row.category}</td>
                  <td>
                    <span className={`badge priority-${row.priority?.toLowerCase()}`}>
                      {row.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${row.status?.toLowerCase().replace(' ', '_')}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>{new Date(row.created_at || Date.now()).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}>
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  filterBar: {
    padding: '0.85rem 1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  statusTabs: {
    display: 'flex',
    gap: '0.35rem',
  },
  tabBtn: {
    padding: '0.45rem 0.85rem',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    color: '#94a3b8',
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tabBtnActive: {
    background: '#6366f1',
    color: '#ffffff',
  },
  controlsGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  viewToggle: {
    display: 'flex',
    background: 'rgba(15, 23, 42, 0.6)',
    padding: '0.2rem',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  toggleBtn: {
    padding: '0.35rem 0.6rem',
    border: 'none',
    background: 'transparent',
    color: '#94a3b8',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  toggleActive: {
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.25rem',
  },
  centerState: {
    padding: '4rem 2rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.85rem',
  },
  tableHeader: {
    textAlign: 'left',
    color: '#64748b',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '0.75rem 1rem',
  },
  tableRow: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
    padding: '0.75rem 1rem',
  },
};
