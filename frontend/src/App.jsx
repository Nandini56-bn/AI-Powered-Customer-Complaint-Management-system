import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import UploadModal from './components/UploadModal';
import ComplaintForm from './components/ComplaintForm';
import ComplaintDetailModal from './components/ComplaintDetailModal';
import AIChatWidget from './components/AIChatWidget';
import Dashboard from './pages/Dashboard';
import ComplaintsList from './pages/ComplaintsList';
import Analytics from './pages/Analytics';

function MainLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'complaints': return 'Customer Complaints List';
      case 'analytics': return 'AI Intelligence & Analytics';
      default: return 'Dashboard Overview';
    }
  };

  return (
    <div className="app-container">
      {/* Fixed Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content View Area */}
      <div className="main-content">
        <Navbar activeTabTitle={getTabTitle()} />
        <main className="page-wrapper">
          {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}
          {activeTab === 'complaints' && <ComplaintsList />}
          {activeTab === 'analytics' && <Analytics />}
        </main>
      </div>

      {/* Overlays & Modals */}
      <UploadModal />
      <ComplaintForm />
      <ComplaintDetailModal />
      <AIChatWidget />
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <MainLayout />
    </Provider>
  );
}
