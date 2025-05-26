import { TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

type SortField = 'first_name' | 'last_name' | 'firm' | 'city' | 'province' | 'title' | 'branch' | 'team_name';
type SortDirection = 'asc' | 'desc';

interface AdvisorTableHeaderProps {
  onSort: (field: SortField) => void;
  sortField?: SortField;
  sortDirection?: SortDirection;
}

export function AdvisorTableHeader({ onSort, sortField, sortDirection }: AdvisorTableHeaderProps) {
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const SortableHeader = ({ field, children, widthClass }: { field: SortField; children: React.ReactNode; widthClass: string }) => (
    <TableHead className={`px-2 py-2 font-semibold text-slate-700 bg-white ${widthClass}`}>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-1 font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1"
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
        <SortableHeader field="first_name" widthClass="w-[10%]">First Name</SortableHeader>
        <SortableHeader field="last_name" widthClass="w-[10%]">Last Name</SortableHeader>
        <SortableHeader field="title" widthClass="w-[15%]">Title</SortableHeader>
        <SortableHeader field="firm" widthClass="w-[15%]">Firm</SortableHeader>
        <SortableHeader field="branch" widthClass="w-[15%]">Branch</SortableHeader>
        <SortableHeader field="team_name" widthClass="w-[15%]">Team</SortableHeader>
        <SortableHeader field="city" widthClass="w-[10%]">City</SortableHeader>
        <SortableHeader field="province" widthClass="w-[5%]">Province</SortableHeader>
        <TableHead className="px-2 py-2 font-semibold text-slate-700 text-center bg-white w-[5%]">
          Actions
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}