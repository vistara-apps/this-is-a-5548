import React, { useState } from 'react';
import { ArrowLeft, FileText, Clock, CheckCircle, XCircle, AlertCircle, Mail, DollarSign } from 'lucide-react';

export function ClearanceWorkflow({ requests, onUpdateStatus, onBack }) {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showNegotiation, setShowNegotiation] = useState(false);
  const [negotiationTerms, setNegotiationTerms] = useState({
    royaltyPercentage: '',
    upfrontFee: '',
    usageRestrictions: '',
    territoryRights: 'worldwide'
  });

  const statusIcons = {
    pending: Clock,
    inProgress: AlertCircle,
    approved: CheckCircle,
    rejected: XCircle
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'inProgress': return 'status-inProgress';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  const handleContactRightsHolder = (request) => {
    setSelectedRequest(request);
    onUpdateStatus(request.id, { status: 'inProgress' });
    
    // Simulate email sending
    setTimeout(() => {
      alert(`Contact email sent to ${request.rightsHolder}`);
    }, 1000);
  };

  const handleNegotiation = (request) => {
    setSelectedRequest(request);
    setShowNegotiation(true);
  };

  const submitNegotiation = () => {
    if (selectedRequest) {
      onUpdateStatus(selectedRequest.id, {
        status: 'inProgress',
        negotiationTerms: negotiationTerms
      });
      setShowNegotiation(false);
      setSelectedRequest(null);
      setNegotiationTerms({
        royaltyPercentage: '',
        upfrontFee: '',
        usageRestrictions: '',
        territoryRights: 'worldwide'
      });
    }
  };

  const handlePayment = (request) => {
    // Simulate payment processing
    const fee = Math.floor(Math.random() * 1000) + 100;
    if (confirm(`Process payment of $${fee} for sample clearance?`)) {
      onUpdateStatus(request.id, {
        status: 'approved',
        paymentStatus: 'completed',
        licenseAgreementUrl: '/mock-license.pdf'
      });
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const inProgressRequests = requests.filter(r => r.status === 'inProgress');
  const completedRequests = requests.filter(r => r.status === 'approved' || r.status === 'rejected');

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
            <h1 className="text-3xl font-semibold text-textPrimary">Clearance Workflow</h1>
            <p className="text-textSecondary">Manage your sample clearance requests</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-textSecondary">Total Requests</p>
              <p className="text-2xl font-bold text-textPrimary">{requests.length}</p>
            </div>
            <FileText className="w-8 h-8 text-textSecondary" />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-textSecondary">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-textSecondary">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{inProgressRequests.length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-textSecondary">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedRequests.length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Workflow Sections */}
      <div className="space-y-8">
        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-textPrimary mb-4">
              Pending Requests ({pendingRequests.length})
            </h2>
            <div className="space-y-4">
              {pendingRequests.map((request) => {
                const StatusIcon = statusIcons[request.status];
                return (
                  <div key={request.id} className="card p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <StatusIcon className="w-5 h-5 text-yellow-600" />
                          <div>
                            <h3 className="font-semibold text-textPrimary">
                              {request.sample.originalTitle}
                            </h3>
                            <p className="text-sm text-textSecondary">
                              by {request.sample.artist} • Rights: {request.rightsHolder}
                            </p>
                          </div>
                          <span className={getStatusColor(request.status)}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleContactRightsHolder(request)}
                          className="btn-primary flex items-center space-x-2"
                        >
                          <Mail className="w-4 h-4" />
                          <span>Contact Rights Holder</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* In Progress Requests */}
        {inProgressRequests.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-textPrimary mb-4">
              In Progress ({inProgressRequests.length})
            </h2>
            <div className="space-y-4">
              {inProgressRequests.map((request) => {
                const StatusIcon = statusIcons[request.status];
                return (
                  <div key={request.id} className="card p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <StatusIcon className="w-5 h-5 text-blue-600" />
                          <div>
                            <h3 className="font-semibold text-textPrimary">
                              {request.sample.originalTitle}
                            </h3>
                            <p className="text-sm text-textSecondary">
                              by {request.sample.artist} • Rights: {request.rightsHolder}
                            </p>
                          </div>
                          <span className={getStatusColor(request.status)}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                        {request.negotiationTerms && (
                          <div className="bg-gray-50 rounded-lg p-4 mt-3">
                            <p className="text-sm text-textSecondary">Negotiation in progress...</p>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleNegotiation(request)}
                          className="btn-outline"
                        >
                          Negotiate Terms
                        </button>
                        <button
                          onClick={() => handlePayment(request)}
                          className="btn-primary flex items-center space-x-2"
                        >
                          <DollarSign className="w-4 h-4" />
                          <span>Process Payment</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Completed Requests */}
        {completedRequests.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-textPrimary mb-4">
              Completed ({completedRequests.length})
            </h2>
            <div className="space-y-4">
              {completedRequests.map((request) => {
                const StatusIcon = statusIcons[request.status];
                return (
                  <div key={request.id} className="card p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <StatusIcon className={`w-5 h-5 ${request.status === 'approved' ? 'text-green-600' : 'text-red-600'}`} />
                          <div>
                            <h3 className="font-semibold text-textPrimary">
                              {request.sample.originalTitle}
                            </h3>
                            <p className="text-sm text-textSecondary">
                              by {request.sample.artist} • Rights: {request.rightsHolder}
                            </p>
                          </div>
                          <span className={getStatusColor(request.status)}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      {request.status === 'approved' && request.licenseAgreementUrl && (
                        <button className="btn-outline">
                          Download License
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Negotiation Modal */}
      {showNegotiation && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-textPrimary mb-4">
              Negotiate Terms
            </h3>
            <p className="text-textSecondary mb-6">
              Set your negotiation terms for "{selectedRequest.sample.originalTitle}"
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-textSecondary mb-2">
                  Royalty Percentage (%)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 10"
                  value={negotiationTerms.royaltyPercentage}
                  onChange={(e) => setNegotiationTerms(prev => ({
                    ...prev,
                    royaltyPercentage: e.target.value
                  }))}
                  className="input-default"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-textSecondary mb-2">
                  Upfront Fee ($)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 500"
                  value={negotiationTerms.upfrontFee}
                  onChange={(e) => setNegotiationTerms(prev => ({
                    ...prev,
                    upfrontFee: e.target.value
                  }))}
                  className="input-default"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-textSecondary mb-2">
                  Territory Rights
                </label>
                <select
                  value={negotiationTerms.territoryRights}
                  onChange={(e) => setNegotiationTerms(prev => ({
                    ...prev,
                    territoryRights: e.target.value
                  }))}
                  className="input-default"
                >
                  <option value="worldwide">Worldwide</option>
                  <option value="us">United States</option>
                  <option value="europe">Europe</option>
                  <option value="asia">Asia</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-textSecondary mb-2">
                  Usage Restrictions
                </label>
                <textarea
                  placeholder="Any specific usage limitations..."
                  value={negotiationTerms.usageRestrictions}
                  onChange={(e) => setNegotiationTerms(prev => ({
                    ...prev,
                    usageRestrictions: e.target.value
                  }))}
                  className="input-default h-20 resize-none"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowNegotiation(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={submitNegotiation}
                className="btn-primary flex-1"
              >
                Submit Terms
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {requests.length === 0 && (
        <div className="card p-12 text-center">
          <FileText className="w-12 h-12 text-textSecondary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-textPrimary mb-2">
            No clearance requests yet
          </h3>
          <p className="text-textSecondary">
            Upload a track and detect samples to start the clearance process.
          </p>
        </div>
      )}
    </div>
  );
}