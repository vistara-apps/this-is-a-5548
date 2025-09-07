import React from 'react';
import { CheckCircle, Clock, Shield } from 'lucide-react';

export function Hero() {
  const features = [
    {
      icon: CheckCircle,
      title: 'Automated Sample Discovery',
      description: 'Scan your tracks to identify samples and find rights holders instantly'
    },
    {
      icon: Clock,
      title: 'Streamlined Clearance',
      description: 'Manage negotiations, agreements, and payments in one place'
    },
    {
      icon: Shield,
      title: 'Compliance Tracking',
      description: 'Stay compliant with automatic monitoring of license terms'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-primary/5 to-accent/5 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-textPrimary mb-6">
            Sample Clearance
          </h1>
          <p className="text-xl text-textSecondary max-w-3xl mx-auto leading-relaxed">
            Sample Clearance clearance for simple tracks your tracks without your 
            your stuff too.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-textPrimary mb-2">
                  {feature.title}
                </h3>
                <p className="text-textSecondary">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}