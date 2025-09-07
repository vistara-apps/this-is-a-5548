import React, { useState } from 'react';
import { ArrowLeft, Shield, Calendar, AlertTriangle, CheckCircle, FileText, Download } from 'lucide-react';

export function ComplianceTracker({ requests, onBack }) {
  const [filter, setFilter] = useState('all');

  // Mock compliance data
  const complianceData = requests.map(request => ({
    ...request,
    licenseExpiry: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000),
    usageCount: Math.floor(Math.random() * 1000),
    territoryRestrictions: ['US', 'Canada', 'UK'],
    maxUsageLimit: 10000,
    royaltyRate: 0.08 + Math.random() * 0.12,
    lastChecked: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
  }));

  const getComplianceStatus = (item) => {
    const daysUntilExpiry = Math.ceil((item.licenseExpiry - new Date()) / (1000 * 60 * 60 * 24));
    const usagePercentage = (item.usageCount / item.maxUsageLimit) * 100;
    
    if (daysUntilExpiry < 30 || usagePercentage > 90) return 'warning';
    if (daysUntilExpiry < 7 || usagePercentage > 95) return 'critical';
    return 'good';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return AlertTriangle;
      default: return Shield;
    }
  };

  const filteredData = complianceData.filter(item => {
    if (filter === 'all') return true;
    return getComplianceStatus(item) === filter;
  });

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const criticalAlerts = complianceData.filter(item => getComplianceStatus(item) === 'critical').length;
  const warningAlerts = complianceData.filter(item => getComplianceStatus(item) === 'warning').length;

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
            <h1 className="text-3xl font-semibold text-textPrimary">Compliance Tracker</h1>
            <p className="text-textSecondary">Monitor your sample usage rights and license terms</p>
          </div>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Alerts Summary */}
      {(criticalAlerts > 0 || warningAlerts > 0) && (
        <div className="card p-6 mb-8 border-l-4 border-yellow-400">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-textPrimary mb-2">Compliance Alerts</h3>
              <div className="space-y-1">
                {criticalAlerts > 0 && (
                  <p className="text-red-600">
                    {criticalAlerts} critical alert{criticalAlerts !== 1 ? 's' : ''} require immediate attention
                  </p>
                )}
                {warningAlerts > 0 && (
                  <p className="text-yellow-600">
                    {warningAlerts} warning{warningAlerts !== 1 ? 's' : ''} need review
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-textSecondary">Total Cleared</p>
              <p className="text-2xl font-bold text-textPrimary">{complianceData.length}</p>
            </div>
            <Shield className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-textSecondary">Critical Alerts</p>
              <p className="text-2xl font-bold text-red-600">{criticalAlerts}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-textSecondary">Warnings</p>
              <p className="text-2xl font-bold text-yellow-600">{warningAlerts}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-textSecondary">Avg Royalty Rate</p>
              <p className="text-2xl font-bold text-textPrimary">
                {(complianceData.reduce((sum, item) => sum + item.royaltyRate, 0) / complianceData.length * 100).toFixed(1)}%
              </p>
            </div>
            <FileText className="w-8 h-8 text-textSecondary" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'all', label: 'All Items', count: complianceData.length },
          { id: 'critical', label: 'Critical', count: criticalAlerts },
          { id: 'warning', label: 'Warnings', count: warningAlerts },
          { id: 'good', label: 'Good Standing', count: complianceData.filter(item => getComplianceStatus(item) === 'good').length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === tab.id
                ? 'bg-surface text-textPrimary shadow-sm'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Compliance Items */}
      <div className="space-y-4">
        {filteredData.length === 0 ? (
          <div className="card p-12 text-center">
            <Shield className="w-12 h-12 text-textSecondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-textPrimary mb-2">
              No compliance items found
            </h3>
            <p className="text-textSecondary">
              {filter === 'all' 
                ? 'Start by clearing some samples to track compliance.'
                : `No items found with ${filter} status.`
              }
            </p>
          </div>
        ) : (
          filteredData.map((item) => {
            const status = getComplianceStatus(item);
            const StatusIcon = getStatusIcon(status);
            const daysUntilExpiry = Math.ceil((item.licenseExpiry - new Date()) / (1000 * 60 * 60 * 24));
            const usagePercentage = (item.usageCount / item.maxUsageLimit) * 100;

            return (
              <div key={item.id} className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-textPrimary">
                        {item.sample.originalTitle}
                      </h3>
                      <p className="text-sm text-textSecondary">
                        by {item.sample.artist} • {item.rightsHolder}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span>{status === 'good' ? 'Compliant' : status === 'warning' ? 'Warning' : 'Critical'}</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-medium text-textSecondary uppercase tracking-wider">License Expiry</label>
                    <p className={`text-sm font-medium ${daysUntilExpiry < 30 ? 'text-red-600' : 'text-textPrimary'}`}>
                      {formatDate(item.licenseExpiry)}
                    </p>
                    <p className="text-xs text-textSecondary">
                      {daysUntilExpiry > 0 ? `${daysUntilExpiry} days remaining` : 'Expired'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-textSecondary uppercase tracking-wider">Usage</label>
                    <p className="text-sm font-medium text-textPrimary">
                      {item.usageCount.toLocaleString()} / {item.maxUsageLimit.toLocaleString()}
                    </p>
                    <p className={`text-xs ${usagePercentage > 90 ? 'text-red-600' : 'text-textSecondary'}`}>
                      {usagePercentage.toFixed(1)}% used
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-textSecondary uppercase tracking-wider">Royalty Rate</label>
                    <p className="text-sm font-medium text-textPrimary">
                      {(item.royaltyRate * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-textSecondary">Per usage</p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-textSecondary uppercase tracking-wider">Territory</label>
                    <p className="text-sm font-medium text-textPrimary">
                      {item.territoryRestrictions.join(', ')}
                    </p>
                    <p className="text-xs text-textSecondary">Restricted regions</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-textSecondary mb-1">
                    <span>Usage Limit</span>
                    <span>{usagePercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        usagePercentage > 95 ? 'bg-red-500' : 
                        usagePercentage > 90 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-xs text-textSecondary">
                    Last checked: {formatDate(item.lastChecked)}
                  </p>
                  <div className="flex space-x-2">
                    <button className="btn-outline text-sm py-1 px-3">
                      View License
                    </button>
                    <button className="btn-primary text-sm py-1 px-3">
                      Update Usage
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}