
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Mail, Linkedin, Globe, Info, Heart } from 'lucide-react';
import { useState } from 'react';
import { AdvisorDetailPopup } from './AdvisorDetailPopup';
import { FavoritesPopup } from './FavoritesPopup';

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

interface AdvisorTableRowProps {
  advisor: Advisor;
}

export function AdvisorTableRow({ advisor }: AdvisorTableRowProps) {
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [showFavoritesPopup, setShowFavoritesPopup] = useState(false);

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
        <TableCell className="px-3 py-2 font-medium text-slate-900" style={{ width: '120px' }}>
          <div className="truncate" title={advisor.first_name || ''}>
            {advisor.first_name || <span className="text-slate-400">-</span>}
          </div>
        </TableCell>
        <TableCell className="px-3 py-2 font-medium text-slate-900" style={{ width: '120px' }}>
          <div className="truncate" title={advisor.last_name || ''}>
            {advisor.last_name || <span className="text-slate-400">-</span>}
          </div>
        </TableCell>
        <TableCell className="px-3 py-2 text-slate-700">
          {advisor.title || <span className="text-slate-400">-</span>}
        </TableCell>
        <TableCell className="px-3 py-2 text-slate-700">
          {advisor.firm || <span className="text-slate-400">-</span>}
        </TableCell>
        <TableCell className="px-3 py-2 text-slate-700">
          {advisor.branch || <span className="text-slate-400">-</span>}
        </TableCell>
        <TableCell className="px-3 py-2 text-slate-700">
          {advisor.team_name || <span className="text-slate-400">-</span>}
        </TableCell>
        <TableCell className="px-3 py-2 text-slate-700" style={{ width: '100px' }}>
          <div className="truncate" title={advisor.city || ''}>
            {advisor.city || <span className="text-slate-400">-</span>}
          </div>
        </TableCell>
        <TableCell className="px-3 py-2 text-slate-700" style={{ width: '80px' }}>
          <div className="truncate" title={advisor.province || ''}>
            {advisor.province || <span className="text-slate-400">-</span>}
          </div>
        </TableCell>
        <TableCell className="px-3 py-2" style={{ width: '140px' }}>
          <div className="flex flex-wrap items-center justify-center gap-1 max-w-[120px]">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
              onClick={() => setShowDetailPopup(true)}
              title="View Details"
            >
              <Info className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              onClick={() => setShowFavoritesPopup(true)}
              title="Add to Favorites"
            >
              <Heart className="h-3.5 w-3.5" />
            </Button>
            {advisor.email && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                onClick={handleEmailClick}
                title="Send Email"
              >
                <Mail className="h-3.5 w-3.5" />
              </Button>
            )}
            {advisor.linkedin_url && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                onClick={handleLinkedInClick}
                title="View LinkedIn"
              >
                <Linkedin className="h-3.5 w-3.5" />
              </Button>
            )}
            {advisor.website_url && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-500 hover:text-green-600 hover:bg-green-50 transition-colors"
                onClick={handleWebsiteClick}
                title="Visit Website"
              >
                <Globe className="h-3.5 w-3.5" />
              </Button>
            )}
            {!advisor.email && !advisor.linkedin_url && !advisor.website_url && showDetailPopup === false && (
              <span className="text-slate-300 text-xs italic">Info only</span>
            )}
          </div>
        </TableCell>
      </TableRow>
      
      <AdvisorDetailPopup
        advisor={advisor}
        isOpen={showDetailPopup}
        onClose={() => setShowDetailPopup(false)}
      />

      <FavoritesPopup
        advisor={advisor}
        isOpen={showFavoritesPopup}
        onClose={() => setShowFavoritesPopup(false)}
      />
    </>
  );
}
