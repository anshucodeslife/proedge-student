import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { fetchAttendance } from '../../store/slices/attendanceSlice';

export const Attendance = () => {
  const { records, loading } = useSelector(state => state.attendance);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAttendance());
  }, [dispatch]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PRESENT':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'ABSENT':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PRESENT': return 'success';
      case 'ABSENT': return 'danger';
      default: return 'neutral';
    }
  };

  const calculateStats = () => {
    const total = records.length;
    const present = records.filter(r => r.status === 'PRESENT').length;
    const absent = records.filter(r => r.status === 'ABSENT').length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, percentage };
  };

  const stats = calculateStats();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">My Attendance</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Classes</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <Calendar className="text-blue-500" size={32} />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Present</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.present}</p>
            </div>
            <CheckCircle className="text-green-500" size={32} />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Absent</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{stats.absent}</p>
            </div>
            <XCircle className="text-red-500" size={32} />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Percentage</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{stats.percentage}%</p>
            </div>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              stats.percentage >= 75 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <span className={`text-sm font-bold ${
                stats.percentage >= 75 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stats.percentage}%
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Attendance Records */}
      <Card>
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Attendance History</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading attendance...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p>No attendance records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Course</th>
                  <th className="p-4 text-left">Batch</th>
                  <th className="p-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="font-medium">
                          {new Date(record.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-gray-900">
                        {record.batch?.course?.title || 'N/A'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-600">
                        {record.batch?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <Badge variant={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Warning if attendance is low */}
      {stats.percentage < 75 && stats.total > 0 && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <XCircle className="text-red-500 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-red-900">Low Attendance Warning</h3>
              <p className="text-sm text-red-700 mt-1">
                Your attendance is below 75%. Please attend classes regularly to maintain good academic standing.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
