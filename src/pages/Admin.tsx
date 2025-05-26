
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';
import { AdminHeader } from '@/components/AdminHeader';

export default function Admin() {
  const { user } = useAuth();

  // Fetch user profile to check admin role
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, role')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      return data;
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#E5D3BC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  // Redirect non-admin users
  if (!profile || profile.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <AdminHeader profile={profile} />

      {/* Main Content - Wider container */}
      <main className="px-4 lg:px-8 pb-12 pt-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin Dashboard</h2>
            <p className="text-slate-600 mb-4">Manage the platform and view administrative controls</p>
            
            {/* Admin content will go here */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Welcome to Admin Panel</h3>
              <p className="text-slate-600">Administrative features and controls will be configured here.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
