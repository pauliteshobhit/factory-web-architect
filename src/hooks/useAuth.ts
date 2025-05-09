import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';

interface AuthState {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  roleLoading: boolean;
}

export function useAuth() {
  const { toast } = useToast();
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isAdmin: false,
    roleLoading: false,
  });

  const refreshRole = async (userId: string) => {
    console.log('🔍 Refreshing role for user:', userId);
    setState(prev => ({ ...prev, roleLoading: true }));
    
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('❌ Role check error:', error);
        throw error;
      }

      const isAdmin = data?.role === 'admin';
      console.log('✅ Role check result:', { userId, role: data?.role, isAdmin });
      
      setState(prev => ({
        ...prev,
        isAdmin,
        roleLoading: false,
      }));

      return isAdmin;
    } catch (error) {
      console.error('❌ Role refresh failed:', error);
      setState(prev => ({
        ...prev,
        isAdmin: false,
        roleLoading: false,
      }));
      return false;
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(prev => ({
        ...prev,
        user: session?.user ?? null,
        loading: false,
      }));
      if (session?.user) {
        refreshRole(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event);
      setState(prev => ({
        ...prev,
        user: session?.user ?? null,
        loading: false,
      }));
      if (session?.user) {
        refreshRole(session.user.id);
      } else {
        setState(prev => ({ ...prev, isAdmin: false }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      toast({
        title: '❌ Login Failed',
        description: error.message,
        variant: 'destructive',
      });
      return { error };
    }

    if (data.user) {
      await refreshRole(data.user.id);
      toast({
        title: '✅ Login Successful',
        description: 'Welcome back!',
      });
    }

    return { data, error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      toast({
        title: '❌ Signup Failed',
        description: error.message,
        variant: 'destructive',
      });
      return { error };
    }

    if (data.user) {
      await refreshRole(data.user.id);
      toast({
        title: '✅ Signup Successful',
        description: 'Please check your email to verify your account.',
      });
    }

    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: '👋 Logged Out',
      description: 'You have been successfully logged out.',
    });
  };

  return {
    ...state,
    refreshRole,
    signIn,
    signUp,
    signOut,
  };
} 