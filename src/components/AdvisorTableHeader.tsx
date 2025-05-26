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

  const SortableHeader = ({ field, children, widthClass }: { field: SortField; children: React.ReactNode; widthClass: string }) => (
    <TableHead 
      className={`h-10 px-3 font-semibold text-slate-700 border-b-2 border-slate-200 ${widthClass} ${isSticky ? 'sticky top-0 z-10 bg-white' : 'bg-white'}`}
    >
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1 w-full justify-start text-sm"
        onClick={() => onSort(field)}
      >
        <span className="truncate">{children}</span>
        {getSortIcon(field)}
      </Button>
    </TableHead>
  );

  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent border-b-0">
        <SortableHeader field="first_name" widthClass="w-[12%]">
          First Name
        </SortableHeader>
        <SortableHeader field="last_name" widthClass="w-[12%]">
          Last Name
        </SortableHeader>
        <SortableHeader field="title" widthClass="w-[18%]">
          Title
        </SortableHeader>
        <SortableHeader field="firm" widthClass="w-[15%]">
          Firm
        </SortableHeader>
        <SortableHeader field="branch" widthClass="w-[15%]">
          Branch
        </SortableHeader>
        <SortableHeader field="team_name" widthClass="w-[12%]">
          Team
        </SortableHeader>
        <SortableHeader field="city" widthClass="w-[8%]">
          City
        </SortableHeader>
        <SortableHeader field="province" widthClass="w-[8%]">
          Province
        </SortableHeader>
        <TableHead 
          className={`h-10 px-3 font-semibold text-slate-700 text-center border-b-2 border-slate-200 w-[10%] text-sm ${isSticky ? 'sticky top-0 z-10 bg-white' : 'bg-white'}`}
        >
          Actions
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}