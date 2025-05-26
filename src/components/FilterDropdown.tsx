
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface FilterDropdownProps {
  title: string;
  options: string[];
  selectedValues: string[];
  onValueChange: (value: string) => void;
  onClearCategory: () => void;
}

export function FilterDropdown({ title, options, selectedValues, onValueChange, onClearCategory }: FilterDropdownProps) {
  const selectedCount = selectedValues.length;
  
  // Helper function to get proper plural form
  const getPluralForm = (title: string) => {
    if (title === 'City') return 'Cities';
    if (title === 'Branch') return 'Branches';
    return title + 's'; // Province -> Provinces, Firm -> Firms, Team -> Teams
  };
  
  const pluralTitle = getPluralForm(title);
  
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-slate-700">{title}</Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between bg-white border-slate-200"
          >
            <span className="text-sm text-slate-600">
              {selectedCount > 0 ? `${selectedCount} selected` : `All ${pluralTitle}`}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-56 max-h-60 overflow-y-auto bg-white border border-slate-200 shadow-lg z-50"
          align="start"
        >
          <DropdownMenuCheckboxItem
            checked={selectedCount === 0}
            onCheckedChange={onClearCategory}
            className="text-sm cursor-pointer font-medium"
          >
            All {pluralTitle}
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          {options.map((option) => (
            <DropdownMenuCheckboxItem
              key={option}
              checked={selectedValues.includes(option)}
              onCheckedChange={() => onValueChange(option)}
              className="text-sm cursor-pointer"
            >
              {option}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
