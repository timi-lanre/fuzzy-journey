
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
import { ChevronDown, User, Heart, LogOut, BarChart3, Settings } from 'lucide-react';

export function ReportsHeader() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  // Fetch user profile to check admin role
  const { data: profile } = useQuery({
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

  const handleAccountInfo = () => {
    navigate('/account-info');
  };

  const handleFavorites = () => {
    navigate('/favorites');
  };

  const handleAdmin = () => {
    navigate('/admin');
  };

  const isAdmin = profile?.role === 'admin';

  return (
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
                <DropdownMenuItem 
                  onClick={handleAccountInfo}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <User className="h-4 w-4" />
                  Account Info
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDashboard}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleFavorites}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Heart className="h-4 w-4" />
                  Favorites
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem 
                    onClick={handleAdmin}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="h-4 w-4" />
                    Admin
                  </DropdownMenuItem>
                )}
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
  );
}
