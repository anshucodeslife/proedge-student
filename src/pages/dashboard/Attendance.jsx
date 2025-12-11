import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Download, ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '../../api/axios';

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [stats, setStats] = useState({ present: 0, absent: 0, leave: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, [currentMonth]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      const res = await api.get('/student/attendance', {
        params: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
        },
      });

      const data = res.data.data?.attendance || [];
      setAttendanceData(data);

      const present = data.filter(a => a.status === 'PRESENT').length;
      const absent = data.filter(a => a.status === 'ABSENT').length;
      const leave = data.filter(a => a.status === 'ON_LEAVE').length;

      setStats({ present, absent, leave, total: data.length });
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  const getAttendanceForDate = (day) => {
    if (!day) return null;
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;
    return attendanceData.find(a => a.date.split('T')[0] === dateStr);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PRESENT': return 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md';
      case 'ABSENT': return 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md';
      case 'ON_LEAVE': return 'bg-gradient-to-br from-slate-400 to-slate-500 text-white shadow-md';
      default: return 'bg-slate-50 text-slate-400 border border-slate-200';
    }
  };

  const changeMonth = (delta) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1));
  };

  const downloadReport = () => {
    const csv = [
      ['Date', 'Status'],
      ...attendanceData.map(a => [
        new Date(a.date).toLocaleDateString(),
        a.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${currentMonth.getFullYear()}_${currentMonth.getMonth() + 1}.csv`;
    a.click();
  };

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  const days = getDaysInMonth();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const attendancePercentage = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Attendance</h1>
          <p className="text-sm text-slate-600 mt-1">Track your attendance record</p>
        </div>
        <button
          onClick={downloadReport}
          className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Download Report</span>
          <span className="sm:hidden">Download</span>
        </button>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Days */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <CalendarIcon className="text-slate-600" size={20} />
            </div>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 font-medium">Total Days</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">{stats.total}</div>
        </div>

        {/* Present */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <CheckCircle className="text-blue-600" size={20} />
            </div>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 font-medium">Present</div>
          <div className="text-2xl sm:text-3xl font-bold text-blue-600 mt-1">{stats.present}</div>
          <div className="text-xs text-slate-500 mt-1">{attendancePercentage}%</div>
        </div>

        {/* Absent */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <XCircle className="text-orange-600" size={20} />
            </div>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 font-medium">Absent</div>
          <div className="text-2xl sm:text-3xl font-bold text-orange-600 mt-1">{stats.absent}</div>
        </div>

        {/* On Leave */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <Clock className="text-slate-600" size={20} />
            </div>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 font-medium">On Leave</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-600 mt-1">{stats.leave}</div>
        </div>
      </div>

      {/* Calendar Card */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-slate-100">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 hidden sm:block" />
            <span className="text-sm sm:text-xl">{monthName}</span>
          </h2>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Week day headers */}
          {weekDays.map(day => (
            <div key={day} className="text-center font-semibold text-slate-600 py-2 text-xs sm:text-sm">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.slice(0, 1)}</span>
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day, index) => {
            const attendance = getAttendanceForDate(day);
            const statusColor = attendance ? getStatusColor(attendance.status) : 'bg-slate-50 text-slate-900';

            return (
              <div
                key={index}
                className={`aspect-square flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium ${day ? statusColor : ''
                  } ${day ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
                title={attendance ? attendance.status : ''}
              >
                {day || ''}
              </div>
            );
          })}
        </div>

        {/* Legend - Responsive */}
        <div className="mt-6 flex flex-wrap gap-3 sm:gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded shadow-sm"></div>
            <span className="text-xs sm:text-sm text-slate-600 font-medium">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded shadow-sm"></div>
            <span className="text-xs sm:text-sm text-slate-600 font-medium">Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-slate-400 to-slate-500 rounded shadow-sm"></div>
            <span className="text-xs sm:text-sm text-slate-600 font-medium">On Leave</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-slate-50 border border-slate-300 rounded"></div>
            <span className="text-xs sm:text-sm text-slate-600 font-medium">No Record</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
