
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, User, Heart, FileText, LogOut } from 'lucide-react';

export default function AccountInfo() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Fetch user profile
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleAbout = () => {
    navigate('/about');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handleFavorites = () => {
    navigate('/favorites');
  };

  const handleReports = () => {
    navigate('/reports');
  };

  const handleChangePassword = () => {
    // Placeholder for change password functionality
    console.log('Change password clicked - placeholder');
  };

  return (
    <div className="min-h-screen bg-[#E5D3BC]">
      {/* Header */}
      <header className="bg-[#E5D3BC] border-b border-slate-200 shadow-sm">
        <div className="px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={handleDashboard}>
              <img
                src="/lovable-uploads/107e453f-f4e6-4ee4-9c2f-36119293bb57.png"
                alt="Advisor Connect"
                className="h-16 w-auto object-contain"
              />
            </div>
            
            {/* Navigation Menu */}
            <div className="flex items-center gap-6">
              <Button
                onClick={handleAbout}
                variant="ghost"
                className="text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              >
                About
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-2"
                  >
                    Account
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white">
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer bg-slate-100">
                    <User className="h-4 w-4" />
                    Account Info
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleDashboard}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <User className="h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleFavorites}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Heart className="h-4 w-4" />
                    Favorites
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleReports}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <FileText className="h-4 w-4" />
                    Reports
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 lg:px-12 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Account Information</h1>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    First Name
                  </label>
                  <div className="px-4 py-3 bg-slate-50 rounded-lg border">
                    <span className="text-slate-900">
                      {profile?.first_name || 'Not provided'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name
                  </label>
                  <div className="px-4 py-3 bg-slate-50 rounded-lg border">
                    <span className="text-slate-900">
                      {profile?.last_name || 'Not provided'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <div className="px-4 py-3 bg-slate-50 rounded-lg border">
                  <span className="text-slate-900">
                    {user?.email || 'Not provided'}
                  </span>
                </div>
              </div>
              
              <div className="pt-4">
                <Button
                  onClick={handleChangePassword}
                  variant="outline"
                  className="bg-slate-900 text-white hover:bg-slate-800"
                >
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
