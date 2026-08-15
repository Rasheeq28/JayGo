import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/Dashboard/DashboardView';
import { RenewalTable } from './components/Renewals/RenewalTable';
import { MembersPage } from './components/Members/MembersPage';
import { StatesPage } from './components/States/StatesPage';
import { ClubsPage } from './components/Clubs/ClubsPage';
import { ReportsPage } from './components/Reports/ReportsPage';
import { SettingsPage } from './components/Settings/SettingsPage';
import { BulkRenewalModal } from './components/Renewals/BulkRenewalModal';
import { MemberDetailModal } from './components/Members/MemberDetailModal';

const MainContent: React.FC = () => {
  const { activeTab, bulkRenewModalOpen, setBulkRenewModalOpen } = useApp();

  return (
    <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
      {activeTab === 'dashboard' && <DashboardView />}
      {activeTab === 'renewals' && <RenewalTable />}
      {activeTab === 'members' && <MembersPage />}
      {activeTab === 'states' && <StatesPage />}
      {activeTab === 'clubs' && <ClubsPage />}
      {activeTab === 'reports' && <ReportsPage />}
      {activeTab === 'settings' && <SettingsPage />}

      {/* Global Modals */}
      <BulkRenewalModal isOpen={bulkRenewModalOpen} onClose={() => setBulkRenewModalOpen(false)} />
      <MemberDetailModal />
    </main>
  );
};

export function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <MainContent />
        </div>
      </div>
    </AppProvider>
  );
}

export default App;
