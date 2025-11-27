import React, { useEffect, useState } from 'react';
import { studentApi } from '../../api';
import { Card } from '../../components/ui/Card';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';

export const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      const res = await studentApi.getAttendance();
      setAttendance(res.data);
      setLoading(false);
    };
    fetchAttendance();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading attendance...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Attendance Record</h2>
        <p className="text-slate-500">Track your daily attendance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 flex items-center gap-4 bg-emerald-50 border-emerald-100">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-800">Present Days</p>
            <h3 className="text-2xl font-bold text-emerald-900">
              {attendance.filter(a => a.status === 'Present').length}
            </h3>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4 bg-red-50 border-red-100">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-red-800">Absent Days</p>
            <h3 className="text-2xl font-bold text-red-900">
              {attendance.filter(a => a.status === 'Absent').length}
            </h3>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {attendance.map((record, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800">{record.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    record.status === 'Present' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-400">-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
