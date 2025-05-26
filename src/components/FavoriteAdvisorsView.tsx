
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart } from 'lucide-react';
import { Table, TableBody } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AdvisorTableHeader } from '@/components/AdvisorTableHeader';
import { FavoriteAdvisorTableRow } from '@/components/FavoriteAdvisorTableRow';

type SortField = 'first_name' | 'last_name' | 'firm' | 'city' | 'province' | 'title' | 'branch' | 'team_name';
type SortDirection = 'asc' | 'desc';

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

interface FavoriteAdvisor {
  id: string;
  advisor_id: string;
  advisors: Advisor;
}

interface FavoriteAdvisorsViewProps {
  selectedListId: string;
  selectedListName: string;
  favoriteAdvisors: FavoriteAdvisor[];
  onBackToLists: () => void;
  onSort: (field: SortField) => void;
  sortField?: SortField;
  sortDirection?: SortDirection;
}

export function FavoriteAdvisorsView({ 
  selectedListId, 
  selectedListName, 
  favoriteAdvisors, 
  onBackToLists,
  onSort,
  sortField,
  sortDirection
}: FavoriteAdvisorsViewProps) {
  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            onClick={onBackToLists}
            variant="ghost"
            size="sm"
            className="text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Lists
          </Button>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{selectedListName}</h2>
        <p className="text-slate-600">
          {favoriteAdvisors.length} advisor{favoriteAdvisors.length !== 1 ? 's' : ''}
        </p>
      </div>

      {favoriteAdvisors.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Heart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No advisors in this list</h3>
          <p className="text-slate-600">Add advisors to this list from the dashboard.</p>
        </div>
      ) : (
        <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="relative">
            {/* Sticky Header */}
            <div className="sticky top-0 z-30 bg-white border-b-2 border-slate-200">
              <Table>
                <AdvisorTableHeader 
                  onSort={onSort}
                  sortField={sortField}
                  sortDirection={sortDirection}
                />
              </Table>
            </div>
            
            {/* Scrollable Content */}
            <ScrollArea className="h-[640px] w-full">
              <Table>
                <TableBody>
                  {favoriteAdvisors.map((item) => (
                    <FavoriteAdvisorTableRow
                      key={item.id}
                      advisor={item.advisors as any}
                      favoriteListId={selectedListId}
                      favoriteItemId={item.id}
                    />
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}
