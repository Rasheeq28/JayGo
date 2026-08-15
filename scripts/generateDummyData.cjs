const fs = require('fs');
const path = require('path');

const csvPath = 'C:/Users/rashe/Downloads/justgo_bulk_renewal_dummy_data_v3 (1).csv';
const content = fs.readFileSync(csvPath, 'utf8');
const lines = content.trim().split(/\r?\n/);

const members = [];
for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  const cols = lines[i].split(',');
  members.push({
    member_id: cols[0],
    member_name: cols[1],
    ngb_id: cols[2],
    ngb_name: cols[3],
    state_id: cols[4],
    state_name: cols[5],
    club_id: cols[6],
    club_name: cols[7],
    registration_date: cols[8],
    renewal_date: cols[9],
    renewal_window_start: cols[10],
    renewal_window_end: cols[11],
    days_until_renewal: parseInt(cols[12], 10),
    membership_status: cols[13],
    renewal_status: cols[14],
    eligibility_status_on_2026_08_14: cols[15],
    current_membership_year: cols[16],
    next_membership_year: cols[17],
    is_renewed: cols[14] === 'Already renewed'
  });
}

const states = [
  { state_id: 'ST001', state_name: 'Dhaka State', code: 'DHK', club_count: 3, member_count: members.filter(m => m.state_id === 'ST001').length },
  { state_id: 'ST002', state_name: 'Chattogram State', code: 'CTG', club_count: 2, member_count: members.filter(m => m.state_id === 'ST002').length },
  { state_id: 'ST003', state_name: 'Rajshahi State', code: 'RAJ', club_count: 2, member_count: members.filter(m => m.state_id === 'ST003').length },
  { state_id: 'ST004', state_name: 'Khulna State', code: 'KHL', club_count: 1, member_count: members.filter(m => m.state_id === 'ST004').length }
];

const clubs = [
  { club_id: 'CL001', club_name: 'Dhaka Aquatics Club', state_id: 'ST001', state_name: 'Dhaka State', member_count: members.filter(m => m.club_id === 'CL001').length },
  { club_id: 'CL002', club_name: 'Gulshan Sports Club', state_id: 'ST001', state_name: 'Dhaka State', member_count: members.filter(m => m.club_id === 'CL002').length },
  { club_id: 'CL003', club_name: 'Uttara Swimming Club', state_id: 'ST001', state_name: 'Dhaka State', member_count: members.filter(m => m.club_id === 'CL003').length },
  { club_id: 'CL004', club_name: 'Chattogram Dolphins', state_id: 'ST002', state_name: 'Chattogram State', member_count: members.filter(m => m.club_id === 'CL004').length },
  { club_id: 'CL005', club_name: 'CDA Sports Club', state_id: 'ST002', state_name: 'Chattogram State', member_count: members.filter(m => m.club_id === 'CL005').length },
  { club_id: 'CL006', club_name: 'Rajshahi Swim Academy', state_id: 'ST003', state_name: 'Rajshahi State', member_count: members.filter(m => m.club_id === 'CL006').length },
  { club_id: 'CL007', club_name: 'Padma Sports Club', state_id: 'ST003', state_name: 'Rajshahi State', member_count: members.filter(m => m.club_id === 'CL007').length },
  { club_id: 'CL008', club_name: 'Khulna Aquatics Club', state_id: 'ST004', state_name: 'Khulna State', member_count: members.filter(m => m.club_id === 'CL008').length }
];

const fileContent = `import type { Member, StateOrg, ClubOrg, UserPersona } from "../types";

export const INITIAL_MEMBERS: Member[] = ${JSON.stringify(members, null, 2)};

export const INITIAL_STATES: StateOrg[] = ${JSON.stringify(states, null, 2)};

export const INITIAL_CLUBS: ClubOrg[] = ${JSON.stringify(clubs, null, 2)};

export const NGB_ADMIN_PERSONA: UserPersona = {
  role: "NGB Admin",
  name: "Sarah Rahman",
  title: "NGB Administrator — Bangladesh Swimming Federation",
  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150"
};

export const STATE_ADMIN_PERSONA: UserPersona = {
  role: "State Admin",
  name: "Tanvir Ahmed",
  title: "State Administrator — Dhaka State",
  assigned_state_id: "ST001",
  assigned_state_name: "Dhaka State",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150"
};
`;

const outputPath = path.join(__dirname, '../src/data/dummyData.ts');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log(`Successfully generated src/data/dummyData.ts with ${members.length} members!`);
