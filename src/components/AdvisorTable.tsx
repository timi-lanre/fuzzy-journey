import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AdvisorTableHeader } from './AdvisorTableHeader';
import { AdvisorTableRow } from './AdvisorTableRow';
import { useCallback, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

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

interface AdvisorTableProps {
  advisors: Advisor[];
  onSort: (field: SortField) => void;
  sortField?: SortField;
  sortDirection?: SortDirection;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  totalCount: number;
  displayedCount: number;
}

export function AdvisorTable({ 
  advisors, 
  onSort,
  sortField,
  sortDirection,
  hasNextPage, 
  isFetchingNextPage, 
  fetchNextPage,
  totalCount,
  displayedCount
}: AdvisorTableProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (!scrollContainer) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
    
    if (scrollPercentage > 0.9 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (!scrollContainer) return;

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="relative">
        <div className="sticky top-0 z-30 bg-white">
          <AdvisorTableHeader 
            onSort={onSort} 
            sortField={sortField}
            sortDirection={sortDirection}
          />
        </div>
        
        <ScrollArea className="h-[640px] w-full" ref={scrollAreaRef}>
          <Table>
            <TableBody>
              {advisors?.map((advisor) => (
                <AdvisorTableRow key={advisor.id} advisor={advisor} />
              ))}
              {isFetchingNextPage && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                      <p className="text-slate-500 font-medium">Loading more advisors...</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {advisors && advisors.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl text-slate-400">📋</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No advisors found</h3>
              <p className="text-slate-500">There are no advisors in the database.</p>
            </div>
          )}
        </ScrollArea>
      </div>
      
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-900">{displayedCount.toLocaleString()}</span> of{' '}
          <span className="font-semibold text-slate-900">{totalCount.toLocaleString()}</span> advisors
        </div>
        {hasNextPage && (
          <div className="text-sm text-slate-500">
            Scroll down to load more
          </div>
        )}
      </div>
    </div>
  );
}