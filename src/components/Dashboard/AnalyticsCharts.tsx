import React from 'react';
import { useApp } from '../../context/AppContext';
import { calculateMemberStatus } from '../../utils/renewalLogic';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Building2, PieChart as PieIcon, BarChart2 } from 'lucide-react';

export const AnalyticsCharts: React.FC = () => {
  const { members, states, role } = useApp();

  // 1. Status Donut Data
  const statusCounts = {
    'Eligible': 0,
    'Already renewed': 0,
    'Not yet eligible': 0,
    'Window missed': 0
  };

  members.forEach((m) => {
    const status = calculateMemberStatus(m);
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  const pieData = [
    { name: 'Eligible', value: statusCounts['Eligible'], color: '#10b981' },
    { name: 'Already Renewed', value: statusCounts['Already renewed'], color: '#3b82f6' },
    { name: 'Not Yet Eligible', value: statusCounts['Not yet eligible'], color: '#94a3b8' },
    { name: 'Window Missed', value: statusCounts['Window missed'], color: '#f43f5e' }
  ];

  // 2. Timeline Bar Data (Days until renewal distribution)
  const timelineBuckets: { [key: string]: number } = {
    '0 days': 0,
    '1-2 days': 0,
    '3-5 days': 0,
    '6-7 days': 0,
    'Upcoming': 0,
    'Missed': 0
  };

  members.forEach((m) => {
    const status = calculateMemberStatus(m);
    if (status === 'Window missed') {
      timelineBuckets['Missed']++;
    } else if (status === 'Not yet eligible') {
      timelineBuckets['Upcoming']++;
    } else {
      const days = m.days_until_renewal;
      if (days === 0) timelineBuckets['0 days']++;
      else if (days >= 1 && days <= 2) timelineBuckets['1-2 days']++;
      else if (days >= 3 && days <= 5) timelineBuckets['3-5 days']++;
      else timelineBuckets['6-7 days']++;
    }
  });

  const barData = Object.keys(timelineBuckets).map((key) => ({
    name: key,
    count: timelineBuckets[key]
  }));

  // 3. State Performance Comparison
  const stateData = states.map((s) => {
    const stateMembers = members.filter((m) => m.state_id === s.state_id);
    const eligible = stateMembers.filter((m) => calculateMemberStatus(m) === 'Eligible').length;
    const renewed = stateMembers.filter((m) => calculateMemberStatus(m) === 'Already renewed').length;

    return {
      state_name: s.state_name,
      total: stateMembers.length,
      eligible,
      renewed,
      rate: stateMembers.length > 0 ? Math.round((renewed / stateMembers.length) * 100) : 0
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Renewal Status Donut Chart */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-blue-600" />
              Renewal Status Breakdown
            </h4>
            <span className="text-xs text-slate-400 font-medium">150 Total</span>
          </div>

          <div className="h-48 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any) => [`${value} Members`, name]}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
          {pieData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-slate-600 font-medium truncate">{item.name}:</span>
              <strong className="text-slate-900 font-bold ml-auto">{item.value}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Renewal Timeline Bar Chart */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-600" />
              Days Until Renewal Window
            </h4>
            <span className="text-xs text-slate-400 font-medium">Fixed Date: 14 Aug</span>
          </div>

          <div className="h-48 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 italic text-center pt-2 border-t border-slate-100">
          Members are grouped by remaining days inside their 7-day anniversary renewal window.
        </p>
      </div>

      {/* 3. State Performance Table */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              State Breakdown Performance
            </h4>
            <span className="text-xs text-slate-400 font-medium">{role === 'State Admin' ? 'Dhaka Scoped' : 'All 4 States'}</span>
          </div>

          <div className="divide-y divide-slate-100 mt-2 max-h-48 overflow-y-auto">
            {stateData.map((st) => (
              <div key={st.state_name} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-800">{st.state_name}</p>
                  <p className="text-[10px] text-slate-500">{st.total} Total Members</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {st.eligible} Eligible
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      {st.renewed} Renewed
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Org Conversion:</span>
          <span className="font-bold text-blue-600">
            {Math.round((statusCounts['Already renewed'] / members.length) * 100)}% Complete
          </span>
        </div>
      </div>
    </div>
  );
};
