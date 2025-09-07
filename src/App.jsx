import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AudioUploader } from './components/AudioUploader';
import { SampleDiscovery } from './components/SampleDiscovery';
import { ClearanceWorkflow } from './components/ClearanceWorkflow';
import { ComplianceTracker } from './components/ComplianceTracker';
import { RoyaltyManager } from './components/RoyaltyManager';
import { SubscriptionModal } from './components/SubscriptionModal';
import { LoginModal } from './components/auth/LoginModal';
import { RegisterModal } from './components/auth/RegisterModal';
import { audioProcessingService } from './services/audioProcessing';
import { checkUsageLimits } from './services/stripe';

function AppContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState('home');
  const [currentTrack, setCurrentTrack] = useState(null);
  const [detectedSamples, setDetectedSamples] = useState([]);
  const [clearanceRequests, setClearanceRequests] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTrackUpload = async (file) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    // Check usage limits
    const currentUsage = {
      searches: 0, // This would come from user profile/database
      uploads: 0,
      clearanceRequests: 0
    };
    
    const limits = checkUsageLimits(userProfile?.subscription_tier || 'free', currentUsage);
    
    if (!limits.canUpload) {
      setShowSubscriptionModal(true);
      return;
    }

    setIsProcessing(true);
    setCurrentView('discovery');
    
    try {
      // Validate file
      const validation = audioProcessingService.validateAudioFile(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Create track object
      const track = {
        id: `track-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        file: file,
        uploadedAt: new Date().toISOString()
      };
      
      setCurrentTrack(track);

      // For demo purposes, use mock detection
      // In production, you would use the real service:
      // const uploadResult = await audioProcessingService.uploadAudioFile(file);
      // const samples = await audioProcessingService.detectSamples(uploadResult.data.fileUrl);
      
      const sampleResult = await audioProcessingService.mockSampleDetection(file);
      
      if (sampleResult.success) {
        setDetectedSamples(sampleResult.data);
      } else {
        throw new Error(sampleResult.error);
      }
    } catch (error) {
      console.error('Error processing track:', error);
      // Handle error - show toast notification
      setCurrentView('home');
    } finally {
      setIsProcessing(false);
    }
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

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-textSecondary">Loading SampleSecure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header 
        currentView={currentView}
        onNavigate={setCurrentView}
        user={userProfile || { email: user?.email, subscriptionTier: 'free' }}
        isAuthenticated={isAuthenticated}
        onShowSubscription={() => setShowSubscriptionModal(true)}
        onShowLogin={() => setShowLoginModal(true)}
      />
      
      <main className="pt-16">
        {renderCurrentView()}
      </main>

      {/* Modals */}
      {showSubscriptionModal && (
        <SubscriptionModal 
          currentTier={userProfile?.subscription_tier || 'free'}
          onClose={() => setShowSubscriptionModal(false)}
          onUpgrade={(tier) => {
            setUserProfile(prev => ({ ...prev, subscription_tier: tier }));
            setShowSubscriptionModal(false);
          }}
        />
      )}

      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSwitchToRegister={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
        />
      )}

      {showRegisterModal && (
        <RegisterModal
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          onSwitchToLogin={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />
      )}

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'hsl(0 0% 100%)',
            color: 'hsl(210 40% 20%)',
            border: '1px solid hsl(210 25% 50% / 0.2)',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          },
        }}
      />
    </div>
  );
}

// Main App component with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
