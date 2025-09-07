import React, { useState } from 'react';
import { ArrowLeft, DollarSign, TrendingUp, Users, PieChart, Download, Calendar } from 'lucide-react';

export function RoyaltyManager({ requests, onBack }) {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedTrack, setSelectedTrack] = useState(null);

  // Mock royalty data
  const royaltyData = requests.map(request => ({
    ...request,
    earnings: {
      total: Math.floor(Math.random() * 5000) + 500,
      thisMonth: Math.floor(Math.random() * 800) + 100,
      pending: Math.floor(Math.random() * 200) + 50,
      paid: Math.floor(Math.random() * 4000) + 400
    },
    splits: [
      { name: 'You', percentage: 60, amount: 3000 },
      { name: request.rightsHolder, percentage: 30, amount: 1500 },
      { name: 'Producer Collaboration', percentage: 10, amount: 500 }
    ],
    monthlyEarnings: [
      { month: 'Jan', amount: 450 },
      { month: 'Feb', amount: 680 },
      { month: 'Mar', amount: 820 },
      { month: 'Apr', amount: 590 },
      { month: 'May', amount: 910 },
      { month: 'Jun', amount: 750 }
    ]
  }));

  const totalEarnings = royaltyData.reduce((sum, item) => sum + item.earnings.total, 0);
  const totalPending = royaltyData.reduce((sum, item) => sum + item.earnings.pending, 0);
  const totalPaid = royaltyData.reduce((sum, item) => sum + item.earnings.paid, 0);
  const thisMonthTotal = royaltyData.reduce((sum, item) => sum + item.earnings.thisMonth, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-textSecondary hover:text-textPrimary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-semibold text-textPrimary">Royalty Management</h1>
            <p className="text-textSecondary">Track and manage your sample royalty splits</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input-default"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button className="btn-primary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-textSecondary">Total Earnings</p>
              <p className="text-2xl font-bold text-textPrimary">${totalEarnings.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-xs text-green-600 mt-2">
            +12.5% from last month
          </p>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-textSecondary">This Month</p>
              <p className="text-2xl font-bold text-textPrimary">${thisMonthTotal.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-xs text-blue-600 mt-2">
            +8.2% from last month
          </p>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-textSecondary">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">${totalPending.toLocaleString()}</p>
            </div>
            <Calendar className="w-8 h-8 text-yellow-600" />
          </div>
          <p className="text-xs text-textSecondary mt-2">
            Next payout: 15th
          </p>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-textSecondary">Active Splits</p>
              <p className="text-2xl font-bold text-textPrimary">{royaltyData.length}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-xs text-textSecondary mt-2">
            Across {royaltyData.length} tracks
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Earnings Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-textPrimary mb-4">Monthly Earnings</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {royaltyData[0]?.monthlyEarnings.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-primary rounded-t"
                  style={{ 
                    height: `${(data.amount / 1000) * 200}px`,
                    minHeight: '20px'
                  }}
                />
                <p className="text-xs text-textSecondary mt-2">{data.month}</p>
                <p className="text-xs font-medium text-textPrimary">${data.amount}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Tracks */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-textPrimary mb-4">Top Performing Tracks</h3>
          <div className="space-y-4">
            {royaltyData.slice(0, 5).map((item, index) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-textPrimary">{item.sample.originalTitle}</p>
                    <p className="text-sm text-textSecondary">{item.sample.artist}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-textPrimary">${item.earnings.total.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+{item.earnings.thisMonth}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Royalty Splits */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-textPrimary">Royalty Split Details</h2>
        
        {royaltyData.length === 0 ? (
          <div className="card p-12 text-center">
            <PieChart className="w-12 h-12 text-textSecondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-textPrimary mb-2">
              No royalty data available
            </h3>
            <p className="text-textSecondary">
              Complete some sample clearances to start tracking royalties.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {royaltyData.map((item) => (
              <div key={item.id} className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-textPrimary">
                      {item.sample.originalTitle}
                    </h3>
                    <p className="text-textSecondary">
                      by {item.sample.artist} • Total Earnings: ${item.earnings.total.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedTrack(selectedTrack === item.id ? null : item.id)}
                    className="btn-outline"
                  >
                    {selectedTrack === item.id ? 'Hide Details' : 'View Details'}
                  </button>
                </div>

                {/* Split Visualization */}
                <div className="mb-4">
                  <div className="flex rounded-lg overflow-hidden h-8">
                    {item.splits.map((split, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-center text-white text-sm font-medium ${
                          index === 0 ? 'bg-primary' : 
                          index === 1 ? 'bg-accent' : 'bg-purple-500'
                        }`}
                        style={{ width: `${split.percentage}%` }}
                      >
                        {split.percentage}%
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between mt-3">
                    {item.splits.map((split, index) => (
                      <div key={index} className="text-center">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-primary' : 
                            index === 1 ? 'bg-accent' : 'bg-purple-500'
                          }`} />
                          <span className="text-sm font-medium text-textPrimary">{split.name}</span>
                        </div>
                        <p className="text-sm text-textSecondary">${split.amount.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedTrack === item.id && (
                  <div className="border-t pt-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold text-textPrimary mb-3">Payment Status</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-textSecondary">Paid</span>
                            <span className="font-medium text-green-600">${item.earnings.paid.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-textSecondary">Pending</span>
                            <span className="font-medium text-yellow-600">${item.earnings.pending.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-textSecondary">This Month</span>
                            <span className="font-medium text-textPrimary">${item.earnings.thisMonth.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-textPrimary mb-3">License Details</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-textSecondary">Rights Holder:</span> {item.rightsHolder}</p>
                          <p><span className="text-textSecondary">Territory:</span> Worldwide</p>
                          <p><span className="text-textSecondary">Usage Type:</span> Streaming, Physical</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-textPrimary mb-3">Actions</h4>
                        <div className="space-y-2">
                          <button className="btn-outline w-full text-sm">
                            Download Statement
                          </button>
                          <button className="btn-outline w-full text-sm">
                            Request Payout
                          </button>
                          <button className="btn-outline w-full text-sm">
                            Edit Split
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}