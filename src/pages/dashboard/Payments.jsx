import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CreditCard, CheckCircle, XCircle, Download } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { fetchPayments } from '../../store/slices/paymentSlice';

export const Payments = () => {
  const { list: payments, loading } = useSelector(state => state.payments);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPayments());
  }, [dispatch]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'FAILED':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <CreditCard className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'PENDING': return 'warning';
      case 'FAILED': return 'danger';
      default: return 'neutral';
    }
  };

  const totalPaid = payments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Paid</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                ₹{totalPaid.toLocaleString()}
              </p>
            </div>
            <CheckCircle className="text-green-500" size={32} />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{payments.length}</p>
            </div>
            <CreditCard className="text-blue-500" size={32} />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">
                {payments.filter(p => p.status === 'COMPLETED').length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-blue-600 font-bold">
                {payments.length > 0 
                  ? Math.round((payments.filter(p => p.status === 'COMPLETED').length / payments.length) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Payment Records */}
      <Card>
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading payments...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <CreditCard className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p>No payment records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Order ID</th>
                  <th className="p-4 text-left">Course</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <span className="text-gray-900">
                        {new Date(payment.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-sm text-gray-600">
                        {payment.orderId}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-gray-900">
                        {payment.enrollment?.course?.title || 'N/A'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-green-600">
                        ₹{payment.amount?.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payment.status)}
                        <Badge variant={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4">
                      {payment.invoice ? (
                        <button
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                          onClick={() => window.open(payment.invoice.url, '_blank')}
                        >
                          <Download size={16} />
                          Download
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
