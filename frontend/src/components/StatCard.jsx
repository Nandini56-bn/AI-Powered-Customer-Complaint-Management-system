import React from 'react';

export default function StatCard({ title, value, icon: Icon, color, trend }) {
  const getGradient = (col) => {
    switch (col) {
      case 'amber': return 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.05) 100%)';
      case 'blue': return 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.05) 100%)';
      case 'emerald': return 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.05) 100%)';
      case 'rose': return 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.05) 100%)';
      case 'indigo': default: return 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.05) 100%)';
    }
  };

  const getColorHex = (col) => {
    switch (col) {
      case 'amber': return '#f59e0b';
      case 'blue': return '#3b82f6';
      case 'emerald': return '#10b981';
      case 'rose': return '#ef4444';
      case 'indigo': default: return '#6366f1';
    }
  };

  return (
    <div className="glass-panel glass-panel-interactive" style={{ ...styles.card, background: getGradient(color) }}>
      <div style={styles.header}>
        <span style={styles.title}>{title}</span>
        <div style={{ ...styles.iconBox, background: `${getColorHex(color)}22`, borderColor: `${getColorHex(color)}44` }}>
          <Icon size={20} color={getColorHex(color)} />
        </div>
      </div>
      <div style={styles.body}>
        <span style={styles.value}>{value}</span>
        {trend && (
          <span style={{ ...styles.trend, color: trend.startsWith('+') ? '#34d399' : '#f87171' }}>
            {trend} vs last week
          </span>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    padding: '1.25rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '120px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  iconBox: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.75rem',
    marginTop: '0.75rem',
  },
  value: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#ffffff',
    fontFamily: 'Outfit, sans-serif',
  },
  trend: {
    fontSize: '0.75rem',
    fontWeight: 600,
  },
};
