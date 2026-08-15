import type { Member, RenewalStatus } from '../types';

export const PROTOTYPE_TODAY = '2026-08-14';
export const STANDARD_RENEWAL_FEE = 120; // £120 per member

/**
 * Calculates member eligibility dynamically based on prototype TODAY date (2026-08-14)
 */
export function calculateMemberStatus(member: Member, todayStr: string = PROTOTYPE_TODAY): RenewalStatus {
  if (member.is_renewed || member.renewal_status === 'Already renewed') {
    return 'Already renewed';
  }

  const today = new Date(todayStr);
  const windowStart = new Date(member.renewal_window_start);
  const windowEnd = new Date(member.renewal_window_end);

  // Set time to zero for clean comparison
  today.setHours(0, 0, 0, 0);
  windowStart.setHours(0, 0, 0, 0);
  windowEnd.setHours(0, 0, 0, 0);

  if (today >= windowStart && today <= windowEnd) {
    return 'Eligible';
  } else if (today < windowStart) {
    return 'Not yet eligible';
  } else {
    return 'Window missed';
  }
}

/**
 * Calculate days until renewal date from today
 */
export function getDaysUntilRenewal(renewalDateStr: string, todayStr: string = PROTOTYPE_TODAY): number {
  const today = new Date(todayStr);
  const renewalDate = new Date(renewalDateStr);
  today.setHours(0, 0, 0, 0);
  renewalDate.setHours(0, 0, 0, 0);

  const diffTime = renewalDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format ISO date string into readable text (e.g. 15 Aug 2026)
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Format date range for window (e.g. 9–15 Aug)
 */
export function formatDateWindow(startStr: string, endStr: string): string {
  if (!startStr || !endStr) return '';
  const start = new Date(startStr);
  const end = new Date(endStr);
  
  const startDay = start.getDate();
  const endDay = end.getDate();
  const monthStr = end.toLocaleDateString('en-GB', { month: 'short' });

  if (start.getMonth() === end.getMonth()) {
    return `${startDay}–${endDay} ${monthStr}`;
  } else {
    const startMonthStr = start.toLocaleDateString('en-GB', { month: 'short' });
    return `${startDay} ${startMonthStr} – ${endDay} ${monthStr}`;
  }
}
