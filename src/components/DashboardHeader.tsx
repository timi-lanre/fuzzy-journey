
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, User, Heart, LogOut, BarChart3, Settings } from 'lucide-react';

interface DashboardHeaderProps {
  profile: {
    first_name: string | null;
    last_name: string | null;
    role?: string;
  } | null;
}

export function DashboardHeader({ profile }: DashboardHeaderProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleAbout = () => {
    navigate('/about');
  };

  const handleAccountInfo = () => {
    navigate('/account-info');
  };

  const handleFavorites = () => {
    navigate('/favorites');
  };

  const handleReports = () => {
    navigate('/reports');
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
          <div className="flex items-center">
            <img
              src="/lovable-uploads/107e453f-f4e6-4ee4-9c2f-36119293bb57.png"
              alt="Advisor Connect"
              className="h-16 w-auto object-contain"
            />
          </div>
          
          {/* User Info and Navigation */}
          <div className="flex items-center gap-6">
            {/* Welcome message */}
            {profile && (
              <div className="hidden sm:block text-slate-700">
                Welcome back, {profile.first_name || 'User'}!
              </div>
            )}
            
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
                  <BarChart3 className="h-4 w-4" />
                  Reports
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
