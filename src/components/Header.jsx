import React from 'react';
import { Music, Home, Search, FileText, DollarSign, Settings } from 'lucide-react';

export function Header({ currentView, onNavigate, user, onShowSubscription }) {
  const navigation = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'discovery', label: 'Sample Search', icon: Search },
    { id: 'workflow', label: 'Clearance', icon: FileText },
    { id: 'compliance', label: 'Compliance', icon: Settings },
    { id: 'royalties', label: 'Royalties', icon: DollarSign },
  ];

  const getTierColor = (tier) => {
    switch (tier) {
      case 'premium': return 'text-purple-600';
      case 'pro': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-textPrimary">SampleSecure</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                    isActive 
                      ? 'text-primary bg-blue-50' 
                      : 'text-textSecondary hover:text-textPrimary hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium text-textPrimary">{user.email}</div>
              <div className={`text-xs font-medium ${getTierColor(user.subscriptionTier)}`}>
                {user.subscriptionTier.charAt(0).toUpperCase() + user.subscriptionTier.slice(1)} Plan
              </div>
            </div>
            <button 
              onClick={onShowSubscription}
              className="btn-primary text-sm py-2 px-4"
            >
              Upgrade
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 bg-surface">
        <div className="flex items-center justify-around py-2">
          {navigation.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center py-2 px-3 text-xs ${
                  isActive ? 'text-primary' : 'text-textSecondary'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}