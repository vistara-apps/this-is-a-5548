import React from 'react';
import { X, Check, Star, Zap, Crown } from 'lucide-react';

export function SubscriptionModal({ currentTier, onClose, onUpgrade }) {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'forever',
      icon: Star,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      features: [
        '2 track uploads per month',
        'Basic sample detection',
        'Manual clearance workflow',
        'Community support'
      ],
      limitations: [
        'Limited search results',
        'No automated workflows',
        'No compliance tracking'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29,
      period: 'month',
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      popular: true,
      features: [
        'Unlimited track uploads',
        'Advanced sample detection',
        'Automated workflow management',
        'Basic compliance tracking',
        'Email support',
        'Royalty split calculator'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 79,
      period: 'month',
      icon: Crown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      features: [
        'Everything in Pro',
        'Advanced compliance monitoring',
        'Automated royalty distribution',
        'Priority support',
        'Custom reporting',
        'API access',
        'White-label options'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-textPrimary">Choose Your Plan</h2>
            <p className="text-textSecondary">Unlock the full power of SampleSecure</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-textSecondary hover:text-textPrimary transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Plans */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isCurrentPlan = currentTier === plan.id;
              const isUpgrade = !isCurrentPlan;

              return (
                <div
                  key={plan.id}
                  className={`relative card p-6 ${
                    plan.popular ? 'ring-2 ring-primary border-primary' : ''
                  } ${isCurrentPlan ? 'bg-gray-50 border-gray-300' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 ${plan.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`w-8 h-8 ${plan.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-textPrimary mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-textPrimary">${plan.price}</span>
                      <span className="text-textSecondary">/{plan.period}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-textPrimary">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations && plan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-textSecondary">{limitation}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => isUpgrade ? onUpgrade(plan.id) : null}
                    disabled={isCurrentPlan}
                    className={`w-full py-3 px-4 rounded-md font-semibold transition-colors ${
                      isCurrentPlan
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : plan.popular
                        ? 'bg-primary text-white hover:opacity-90'
                        : 'bg-gray-100 text-textPrimary hover:bg-gray-200'
                    }`}
                  >
                    {isCurrentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Features Comparison */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-textPrimary mb-6 text-center">
              Feature Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 text-textPrimary font-medium">Feature</th>
                    <th className="text-center py-3 text-textPrimary font-medium">Free</th>
                    <th className="text-center py-3 text-textPrimary font-medium">Pro</th>
                    <th className="text-center py-3 text-textPrimary font-medium">Premium</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  {[
                    ['Track uploads', '2/month', 'Unlimited', 'Unlimited'],
                    ['Sample detection', 'Basic', 'Advanced', 'Advanced'],
                    ['Workflow automation', '✗', '✓', '✓'],
                    ['Compliance tracking', '✗', 'Basic', 'Advanced'],
                    ['Royalty management', '✗', 'Basic', 'Advanced'],
                    ['API access', '✗', '✗', '✓'],
                    ['Priority support', '✗', '✗', '✓']
                  ].map(([feature, free, pro, premium], index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 text-textPrimary">{feature}</td>
                      <td className="py-3 text-center text-textSecondary">{free}</td>
                      <td className="py-3 text-center text-textSecondary">{pro}</td>
                      <td className="py-3 text-center text-textSecondary">{premium}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-12 text-center">
            <p className="text-textSecondary mb-4">
              Have questions? Check our{' '}
              <a href="#" className="text-primary hover:underline">FAQ</a> or{' '}
              <a href="#" className="text-primary hover:underline">contact support</a>.
            </p>
            <p className="text-xs text-textSecondary">
              All plans include a 14-day free trial. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}