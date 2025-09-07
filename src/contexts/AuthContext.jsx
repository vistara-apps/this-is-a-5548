import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getCurrentUser, signIn, signUp, signOut } from '../services/supabase';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
            toast.success('Successfully signed in!');
            break;
          case 'SIGNED_OUT':
            toast.success('Successfully signed out!');
            break;
          case 'TOKEN_REFRESHED':
            console.log('Token refreshed');
            break;
          case 'USER_UPDATED':
            toast.success('Profile updated!');
            break;
          default:
            break;
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await signIn(email, password);
      
      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, userData = {}) => {
    try {
      setLoading(true);
      const { data, error } = await signUp(email, password);
      
      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      // Create user profile in database
      if (data.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([{
            id: data.user.id,
            email: data.user.email,
            subscription_tier: 'free',
            payment_status: 'active',
            created_at: new Date().toISOString(),
            ...userData
          }]);

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }
      }

      toast.success('Account created! Please check your email to verify your account.');
      return { success: true, data };
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An unexpected error occurred');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await signOut();
      
      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An unexpected error occurred');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      
      // Update auth user metadata
      const { data: authData, error: authError } = await supabase.auth.updateUser({
        data: updates
      });

      if (authError) {
        toast.error(authError.message);
        return { success: false, error: authError };
      }

      // Update user profile in database
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select();

      if (profileError) {
        console.error('Error updating profile:', profileError);
        toast.error('Failed to update profile');
        return { success: false, error: profileError };
      }

      toast.success('Profile updated successfully!');
      return { success: true, data: { auth: authData, profile: profileData } };
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('An unexpected error occurred');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      toast.success('Password reset email sent! Check your inbox.');
      return { success: true, data };
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('An unexpected error occurred');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      toast.success('Password updated successfully!');
      return { success: true, data };
    } catch (error) {
      console.error('Update password error:', error);
      toast.error('An unexpected error occurred');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const getUserProfile = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error getting user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  };

  const value = {
    user,
    session,
    loading,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    updatePassword,
    getUserProfile,
    isAuthenticated: !!user,
    isLoading: loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
