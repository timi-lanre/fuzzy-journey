
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Mail, Linkedin, Globe, Info, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AdvisorDetailPopup } from './AdvisorDetailPopup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Advisor {
  id: string;
  first_name: string | null;
  last_name: string | null;
  title: string | null;
  firm: string | null;
  branch: string | null;
  team_name: string | null;
  city: string | null;
  province: string | null;
  email: string | null;
  linkedin_url: string | null;
  website_url: string | null;
}

interface FavoriteAdvisorTableRowProps {
  advisor: Advisor;
  favoriteListId: string;
  favoriteItemId: string;
}

export function FavoriteAdvisorTableRow({ advisor, favoriteListId, favoriteItemId }: FavoriteAdvisorTableRowProps) {
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const queryClient = useQueryClient();

  const removeMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('favorite_list_items')
        .delete()
        .eq('id', favoriteItemId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite-list-items', favoriteListId] });
      toast.success('Advisor removed from favorites');
    },
    onError: () => {
      toast.error('Failed to remove advisor from favorites');
    },
  });

  const handleEmailClick = () => {
    if (advisor.email) {
      window.open(`mailto:${advisor.email}`, '_blank');
    }
  };

  const handleLinkedInClick = () => {
    if (advisor.linkedin_url) {
      window.open(advisor.linkedin_url, '_blank');
    }
  };

  const handleWebsiteClick = () => {
    if (advisor.website_url) {
      window.open(advisor.website_url, '_blank');
    }
  };

  return (
    <>
      <TableRow className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
        <TableCell className="px-3 py-4 font-medium text-slate-900" style={{ width: '120px' }}>
          <div className="truncate" title={advisor.first_name || ''}>
            {advisor.first_name || <span className="text-slate-400">-</span>}
          </div>
        </TableCell>
        <TableCell className="px-3 py-4 font-medium text-slate-900" style={{ width: '120px' }}>
          <div className="truncate" title={advisor.last_name || ''}>
            {advisor.last_name || <span className="text-slate-400">-</span>}
          </div>
        </TableCell>
        <TableCell className="px-6 py-4 text-slate-700">
          {advisor.title || <span className="text-slate-400">-</span>}
        </TableCell>
        <TableCell className="px-6 py-4 text-slate-700">
          {advisor.firm || <span className="text-slate-400">-</span>}
        </TableCell>
        <TableCell className="px-6 py-4 text-slate-700">
          {advisor.branch || <span className="text-slate-400">-</span>}
        </TableCell>
        <TableCell className="px-6 py-4 text-slate-700">
          {advisor.team_name || <span className="text-slate-400">-</span>}
        </TableCell>
        <TableCell className="px-3 py-4 text-slate-700" style={{ width: '100px' }}>
          <div className="truncate" title={advisor.city || ''}>
            {advisor.city || <span className="text-slate-400">-</span>}
          </div>
        </TableCell>
        <TableCell className="px-3 py-4 text-slate-700" style={{ width: '80px' }}>
          <div className="truncate" title={advisor.province || ''}>
            {advisor.province || <span className="text-slate-400">-</span>}
          </div>
        </TableCell>
        <TableCell className="px-6 py-4" style={{ width: '140px' }}>
          <div className="flex flex-wrap items-center justify-center gap-1 max-w-[120px]">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
              onClick={() => setShowDetailPopup(true)}
              title="View Details"
            >
              <Info className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              onClick={() => removeMutation.mutate()}
              title="Remove from Favorites"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            {advisor.email && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                onClick={handleEmailClick}
                title="Send Email"
              >
                <Mail className="h-4 w-4" />
              </Button>
            )}
            {advisor.linkedin_url && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                onClick={handleLinkedInClick}
                title="View LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
            )}
            {advisor.website_url && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-500 hover:text-green-600 hover:bg-green-50 transition-colors"
                onClick={handleWebsiteClick}
                title="Visit Website"
              >
                <Globe className="h-4 w-4" />
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>
      
      <AdvisorDetailPopup
        advisor={advisor}
        isOpen={showDetailPopup}
        onClose={() => setShowDetailPopup(false)}
      />
    </>
  );
}
