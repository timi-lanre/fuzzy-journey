
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Filter, RotateCcw } from 'lucide-react';

interface FilterHeaderProps {
  hasActiveFilters: boolean;
  activeFilterCount: number;
  onClearFilters: () => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export function FilterHeader({ 
  hasActiveFilters, 
  activeFilterCount, 
  onClearFilters, 
  isExpanded, 
  onToggleExpanded 
}: FilterHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <CardTitle className="flex items-center gap-2 text-lg">
        <Filter className="h-5 w-5" />
        Filters
        {hasActiveFilters && (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
            {activeFilterCount} active
          </span>
        )}
      </CardTitle>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          disabled={!hasActiveFilters}
          className="h-8 px-2 text-slate-600 hover:text-slate-900"
          title="Reset all filters"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleExpanded}
          className="h-8 w-8 p-0"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
