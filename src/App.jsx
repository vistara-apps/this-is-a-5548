import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AudioUploader } from './components/AudioUploader';
import { SampleDiscovery } from './components/SampleDiscovery';
import { ClearanceWorkflow } from './components/ClearanceWorkflow';
import { ComplianceTracker } from './components/ComplianceTracker';
import { RoyaltyManager } from './components/RoyaltyManager';
import { SubscriptionModal } from './components/SubscriptionModal';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [currentTrack, setCurrentTrack] = useState(null);
  const [detectedSamples, setDetectedSamples] = useState([]);
  const [clearanceRequests, setClearanceRequests] = useState([]);
  const [user, setUser] = useState({
    id: 'user-1',
    email: 'artist@example.com',
    subscriptionTier: 'free',
    paymentStatus: 'active'
  });
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const handleTrackUpload = (track) => {
    setCurrentTrack(track);
    setCurrentView('discovery');
    
    // Simulate sample detection
    setTimeout(() => {
      const mockSamples = [
        {
          id: 'sample-1',
          originalTrackId: 'original-1',
          originalTitle: 'Classic Soul Track',
          artist: 'Soul Legend',
          startTime: 15.5,
          endTime: 25.2,
          confidence: 0.95,
          rightsHolder: 'Universal Music Group'
        },
        {
          id: 'sample-2',
          originalTrackId: 'original-2',
          originalTitle: 'Vintage Hip-Hop Beat',
          artist: 'Beat Master',
          startTime: 45.1,
          endTime: 52.8,
          confidence: 0.87,
          rightsHolder: 'Independent Label'
        }
      ];
      setDetectedSamples(mockSamples);
    }, 2000);
  };

  const handleClearanceRequest = (sample) => {
    const newRequest = {
      id: `request-${Date.now()}`,
      trackId: currentTrack?.id,
      sampleId: sample.id,
      rightsHolder: sample.rightsHolder,
      status: 'pending',
      negotiationTerms: null,
      licenseAgreementUrl: null,
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      sample
    };
    
    setClearanceRequests(prev => [...prev, newRequest]);
    setCurrentView('workflow');
  };

  const updateClearanceStatus = (requestId, updates) => {
    setClearanceRequests(prev => 
      prev.map(req => req.id === requestId ? { ...req, ...updates } : req)
    );
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'discovery':
        return (
          <SampleDiscovery 
            track={currentTrack}
            samples={detectedSamples}
            onClearanceRequest={handleClearanceRequest}
            onBack={() => setCurrentView('home')}
          />
        );
      case 'workflow':
        return (
          <ClearanceWorkflow 
            requests={clearanceRequests}
            onUpdateStatus={updateClearanceStatus}
            onBack={() => setCurrentView('discovery')}
          />
        );
      case 'compliance':
        return (
          <ComplianceTracker 
            requests={clearanceRequests.filter(r => r.status === 'approved')}
            onBack={() => setCurrentView('home')}
          />
        );
      case 'royalties':
        return (
          <RoyaltyManager 
            requests={clearanceRequests.filter(r => r.status === 'approved')}
            onBack={() => setCurrentView('home')}
          />
        );
      default:
        return (
          <div>
            <Hero />
            <AudioUploader 
              onUpload={handleTrackUpload}
              userTier={user.subscriptionTier}
              onUpgradeNeeded={() => setShowSubscriptionModal(true)}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <Header 
        currentView={currentView}
        onNavigate={setCurrentView}
        user={user}
        onShowSubscription={() => setShowSubscriptionModal(true)}
      />
      
      <main className="pt-16">
        {renderCurrentView()}
      </main>

      {showSubscriptionModal && (
        <SubscriptionModal 
          currentTier={user.subscriptionTier}
          onClose={() => setShowSubscriptionModal(false)}
          onUpgrade={(tier) => {
            setUser(prev => ({ ...prev, subscriptionTier: tier }));
            setShowSubscriptionModal(false);
          }}
        />
      )}
    </div>
  );
}

export default App;