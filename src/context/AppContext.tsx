import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Member, RoleType, UserPersona, DashboardStats, RenewalStatus } from '../types';
import { INITIAL_MEMBERS, NGB_ADMIN_PERSONA, STATE_ADMIN_PERSONA, INITIAL_STATES, INITIAL_CLUBS } from '../data/dummyData';
import { calculateMemberStatus, PROTOTYPE_TODAY } from '../utils/renewalLogic';

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
}

interface AppContextType {
  role: RoleType;
  setRole: (role: RoleType) => void;
  userPersona: UserPersona;
  
  members: Member[];
  states: typeof INITIAL_STATES;
  clubs: typeof INITIAL_CLUBS;

  // Global Navigation & Active View
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Filter States
  selectedState: string;
  setSelectedState: (stateId: string) => void;
  selectedClub: string;
  setSelectedClub: (clubId: string) => void;
  selectedStatusFilter: string;
  setSelectedStatusFilter: (status: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Member Detail Modal
  selectedMemberDetailId: string | null;
  setSelectedMemberDetailId: (id: string | null) => void;

  // Bulk Selection State
  selectedMemberIds: string[];
  setSelectedMemberIds: React.Dispatch<React.SetStateAction<string[]>>;
  toggleSelectMember: (id: string) => void;
  toggleSelectAll: (memberIdsToSelect: string[]) => void;
  clearSelection: () => void;

  // Renewal Actions
  bulkRenewModalOpen: boolean;
  setBulkRenewModalOpen: (open: boolean) => void;
  renewSingleMember: (memberId: string) => void;
  renewBulkMembers: (memberIds: string[]) => void;
  resetDemoData: () => void;

  // Notifications
  notifications: Notification[];
  addNotification: (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => void;
  removeNotification: (id: string) => void;

  // Computed Stats
  getDashboardStats: (scopedStateId?: string) => DashboardStats;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'justgo_demo_members_v1';
const LOCAL_STORAGE_ROLE_KEY = 'justgo_demo_role_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<RoleType>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_ROLE_KEY);
    return (saved as RoleType) || 'NGB Admin';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved members:', e);
      }
    }
    return INITIAL_MEMBERS;
  });

  // Filters
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedClub, setSelectedClub] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Selection
  const [selectedMemberDetailId, setSelectedMemberDetailId] = useState<string | null>(null);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [bulkRenewModalOpen, setBulkRenewModalOpen] = useState<boolean>(false);

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Annual Renewal Window Open',
      message: '110 members are currently eligible for 2026–2027 renewal.',
      timestamp: 'Just now'
    }
  ]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_ROLE_KEY, role);
    // If switching to State Admin, scope state automatically to Dhaka State (ST001)
    if (role === 'State Admin') {
      setSelectedState('ST001');
      setSelectedClub('All');
    }
  }, [role]);

  const userPersona = role === 'NGB Admin' ? NGB_ADMIN_PERSONA : STATE_ADMIN_PERSONA;

  const setRole = (newRole: RoleType) => {
    setRoleState(newRole);
    if (newRole === 'State Admin') {
      setSelectedState('ST001');
      addNotification('info', 'Switched Persona', 'Viewing system as State Admin (Dhaka State). Restricted to Dhaka data.');
    } else {
      setSelectedState('All');
      addNotification('info', 'Switched Persona', 'Viewing system as NGB Admin. Full organizational access restored.');
    }
  };

  const addNotification = (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => {
    const newNotif: Notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: 'Just now'
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 4)]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const toggleSelectMember = (id: string) => {
    setSelectedMemberIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleSelectAll = (memberIdsToSelect: string[]) => {
    const allSelected = memberIdsToSelect.every((id) => selectedMemberIds.includes(id));
    if (allSelected) {
      setSelectedMemberIds((prev) => prev.filter((id) => !memberIdsToSelect.includes(id)));
    } else {
      const newSelected = Array.from(new Set([...selectedMemberIds, ...memberIdsToSelect]));
      setSelectedMemberIds(newSelected);
    }
  };

  const clearSelection = () => {
    setSelectedMemberIds([]);
  };

  const renewSingleMember = (memberId: string) => {
    const target = members.find((m) => m.member_id === memberId);
    if (!target) return;

    setMembers((prev) =>
      prev.map((m) => {
        if (m.member_id === memberId) {
          return {
            ...m,
            renewal_status: 'Already renewed' as RenewalStatus,
            eligibility_status_on_2026_08_14: 'Already renewed' as RenewalStatus,
            is_renewed: true,
            current_membership_year: '2026-2027',
            next_membership_year: '2027-2028',
            renewed_at: PROTOTYPE_TODAY
          };
        }
        return m;
      })
    );

    setSelectedMemberIds((prev) => prev.filter((id) => id !== memberId));
    addNotification('success', 'Renewal Successful', `Member ${target.member_name} (${target.member_id}) renewed for 2026–2027.`);
  };

  const renewBulkMembers = (memberIdsToRenew: string[]) => {
    const count = memberIdsToRenew.length;
    setMembers((prev) =>
      prev.map((m) => {
        if (memberIdsToRenew.includes(m.member_id)) {
          return {
            ...m,
            renewal_status: 'Already renewed' as RenewalStatus,
            eligibility_status_on_2026_08_14: 'Already renewed' as RenewalStatus,
            is_renewed: true,
            current_membership_year: '2026-2027',
            next_membership_year: '2027-2028',
            renewed_at: PROTOTYPE_TODAY
          };
        }
        return m;
      })
    );

    setSelectedMemberIds((prev) => prev.filter((id) => !memberIdsToRenew.includes(id)));
    addNotification('success', 'Bulk Renewal Complete', `Successfully processed ${count} membership renewals for 2026–2027.`);
  };

  const resetDemoData = () => {
    setMembers(INITIAL_MEMBERS);
    setSelectedMemberIds([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    addNotification('info', 'Demo Data Reset', 'All member statuses and renewal states have been restored to default.');
  };

  const getDashboardStats = (scopedStateId?: string): DashboardStats => {
    const stateFilter = role === 'State Admin' ? 'ST001' : scopedStateId;
    const targetMembers = stateFilter && stateFilter !== 'All' ? members.filter((m) => m.state_id === stateFilter) : members;

    let total = targetMembers.length;
    let eligible = 0;
    let renewed = 0;
    let notYet = 0;
    let missed = 0;

    targetMembers.forEach((m) => {
      const status = calculateMemberStatus(m);
      if (status === 'Already renewed') renewed++;
      else if (status === 'Eligible') eligible++;
      else if (status === 'Not yet eligible') notYet++;
      else if (status === 'Window missed') missed++;
    });

    return {
      totalMembers: total,
      eligibleCount: eligible,
      alreadyRenewedCount: renewed,
      notYetEligibleCount: notYet,
      windowMissedCount: missed
    };
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        userPersona,
        members,
        states: INITIAL_STATES,
        clubs: INITIAL_CLUBS,
        activeTab,
        setActiveTab,
        selectedState,
        setSelectedState,
        selectedClub,
        setSelectedClub,
        selectedStatusFilter,
        setSelectedStatusFilter,
        searchQuery,
        setSearchQuery,
        selectedMemberDetailId,
        setSelectedMemberDetailId,
        selectedMemberIds,
        setSelectedMemberIds,
        toggleSelectMember,
        toggleSelectAll,
        clearSelection,
        bulkRenewModalOpen,
        setBulkRenewModalOpen,
        renewSingleMember,
        renewBulkMembers,
        resetDemoData,
        notifications,
        addNotification,
        removeNotification,
        getDashboardStats
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
