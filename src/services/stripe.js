import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key');

export const getStripe = () => stripePromise;

// Subscription tiers configuration
export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      'Up to 3 sample searches per month',
      'Basic sample detection',
      'Manual clearance workflow',
      'Email support'
    ],
    limits: {
      searches: 3,
      uploads: 1,
      clearanceRequests: 2
    }
  },
  pro: {
    name: 'Pro',
    price: 29,
    priceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID || 'price_pro',
    features: [
      'Unlimited sample searches',
      'Advanced sample detection',
      'Automated clearance workflow',
      'Basic royalty split tools',
      'Priority email support',
      'Usage analytics'
    ],
    limits: {
      searches: -1, // unlimited
      uploads: -1,
      clearanceRequests: -1
    }
  },
  premium: {
    name: 'Premium',
    price: 79,
    priceId: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID || 'price_premium',
    features: [
      'Everything in Pro',
      'Advanced royalty split management',
      'Compliance tracking & alerts',
      'API access',
      'White-label options',
      'Dedicated account manager',
      'Phone support'
    ],
    limits: {
      searches: -1,
      uploads: -1,
      clearanceRequests: -1
    }
  }
};

// Create checkout session
export const createCheckoutSession = async (priceId, userId, successUrl, cancelUrl) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
        successUrl,
        cancelUrl,
      }),
    });

    const session = await response.json();
    
    if (session.error) {
      throw new Error(session.error);
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Create customer portal session
export const createPortalSession = async (customerId, returnUrl) => {
  try {
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl,
      }),
    });

    const session = await response.json();
    
    if (session.error) {
      throw new Error(session.error);
    }

    window.location.href = session.url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
};

// Process clearance payment
export const processClearancePayment = async (amount, currency, clearanceRequestId, paymentMethodId) => {
  try {
    const response = await fetch('/api/process-clearance-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        clearanceRequestId,
        paymentMethodId,
      }),
    });

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }

    return result;
  } catch (error) {
    console.error('Error processing clearance payment:', error);
    throw error;
  }
};

// Get subscription status
export const getSubscriptionStatus = async (customerId) => {
  try {
    const response = await fetch(`/api/subscription-status/${customerId}`);
    const subscription = await response.json();
    
    if (subscription.error) {
      throw new Error(subscription.error);
    }

    return subscription;
  } catch (error) {
    console.error('Error getting subscription status:', error);
    throw error;
  }
};

// Check usage limits
export const checkUsageLimits = (userTier, currentUsage) => {
  const tier = SUBSCRIPTION_TIERS[userTier] || SUBSCRIPTION_TIERS.free;
  const limits = tier.limits;

  return {
    canSearch: limits.searches === -1 || currentUsage.searches < limits.searches,
    canUpload: limits.uploads === -1 || currentUsage.uploads < limits.uploads,
    canCreateClearanceRequest: limits.clearanceRequests === -1 || currentUsage.clearanceRequests < limits.clearanceRequests,
    remainingSearches: limits.searches === -1 ? 'unlimited' : Math.max(0, limits.searches - currentUsage.searches),
    remainingUploads: limits.uploads === -1 ? 'unlimited' : Math.max(0, limits.uploads - currentUsage.uploads),
    remainingClearanceRequests: limits.clearanceRequests === -1 ? 'unlimited' : Math.max(0, limits.clearanceRequests - currentUsage.clearanceRequests)
  };
};
