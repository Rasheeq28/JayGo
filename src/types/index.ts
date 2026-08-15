export type MembershipStatus = 'Active' | 'Expired' | 'Pending';

export type RenewalStatus = 'Eligible' | 'Already renewed' | 'Not yet eligible' | 'Window missed';

export type RoleType = 'NGB Admin' | 'State Admin' | 'Club Admin';

export interface Member {
  member_id: string;
  member_name: string;
  ngb_id: string;
  ngb_name: string;
  state_id: string;
  state_name: string;
  club_id: string;
  club_name: string;
  registration_date: string; // YYYY-MM-DD
  renewal_date: string; // YYYY-MM-DD
  renewal_window_start: string; // YYYY-MM-DD
  renewal_window_end: string; // YYYY-MM-DD
  days_until_renewal: number;
  membership_status: MembershipStatus;
  renewal_status: RenewalStatus;
  eligibility_status_on_2026_08_14: RenewalStatus;
  current_membership_year: string;
  next_membership_year: string;
  // Dynamic runtime fields
  is_renewed?: boolean;
  renewed_at?: string;
  fee?: number;
}

export interface StateOrg {
  state_id: string;
  state_name: string;
  code: string;
  club_count: number;
  member_count: number;
}

export interface ClubOrg {
  club_id: string;
  club_name: string;
  state_id: string;
  state_name: string;
  member_count: number;
}

export interface UserPersona {
  role: RoleType;
  name: string;
  title: string;
  assigned_state_id?: string;
  assigned_state_name?: string;
  avatar: string;
}

export interface DashboardStats {
  totalMembers: number;
  eligibleCount: number;
  alreadyRenewedCount: number;
  notYetEligibleCount: number;
  windowMissedCount: number;
}
