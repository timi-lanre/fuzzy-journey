import { TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

type SortField = 'first_name' | 'last_name' | 'firm' | 'city' | 'province' | 'title' | 'branch' | 'team_name';
type SortDirection = 'asc' | 'desc';

interface AdvisorTableHeaderProps {
  onSort: (field: SortField) => void;
  sortField?: SortField;
  sortDirection?: SortDirection;
  isSticky?: boolean;
}

export function AdvisorTableHeader({ onSort, sortField, sortDirection, isSticky = false }: AdvisorTableHeaderProps) {
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const SortableHeader = ({ field, children, width }: { field: SortField; children: React.ReactNode; width: string }) => (
    <TableHead 
      className={`h-12 px-4 font-semibold text-slate-700 border-b-2 border-slate-200 ${isSticky ? 'sticky top-0 z-10 bg-white' : 'bg-white'}`} 
      style={{ width, minWidth: width }}
    >
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2 font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-2 whitespace-nowrap"
        onClick={() => onSort(field)}
      >
        {children}
        {getSortIcon(field)}
      </Button>
    </TableHead>
  );

  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent border-b-0">
        <SortableHeader field="first_name" width="160px">
          First Name
        </SortableHeader>
        <SortableHeader field="last_name" width="160px">
          Last Name
        </SortableHeader>
        <SortableHeader field="title" width="220px">
          Title
        </SortableHeader>
        <SortableHeader field="firm" width="200px">
          Firm
        </SortableHeader>
        <SortableHeader field="branch" width="180px">
          Branch
        </SortableHeader>
        <SortableHeader field="team_name" width="160px">
          Team
        </SortableHeader>
        <SortableHeader field="city" width="140px">
          City
        </SortableHeader>
        <SortableHeader field="province" width="120px">
          Province
        </SortableHeader>
        <TableHead 
          className={`h-12 px-4 font-semibold text-slate-700 text-center border-b-2 border-slate-200 whitespace-nowrap ${isSticky ? 'sticky top-0 z-10 bg-white' : 'bg-white'}`} 
          style={{ width: '180px', minWidth: '180px' }}
        >
          Actions
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}