
import { FilterDropdown } from './FilterDropdown';

interface FilterOptions {
  provinces: string[];
  cities: string[];
  firms: string[];
  branches: string[];
  teams: string[];
  favoriteLists: Array<{ id: string; name: string }>;
  reports: Array<{ id: string; name: string }>;
}

interface SelectedFilters {
  provinces: string[];
  cities: string[];
  firms: string[];
  branches: string[];
  teams: string[];
  favoriteLists: string[];
  reports: string[];
}

interface FilterControlsProps {
  filterOptions: FilterOptions;
  localFilters: SelectedFilters;
  onFilterChange: (category: keyof SelectedFilters, value: string) => void;
  onClearCategory: (category: keyof SelectedFilters) => void;
}

export function FilterControls({ 
  filterOptions, 
  localFilters, 
  onFilterChange, 
  onClearCategory 
}: FilterControlsProps) {
  // Convert favorite lists to strings for the dropdown
  const favoriteListOptions = filterOptions.favoriteLists.map(list => list.name);
  
  // Convert reports to strings for the dropdown
  const reportOptions = filterOptions.reports.map(report => report.name);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-6">
      <FilterDropdown
        title="Province"
        options={filterOptions.provinces}
        selectedValues={localFilters.provinces}
        onValueChange={(value) => onFilterChange('provinces', value)}
        onClearCategory={() => onClearCategory('provinces')}
      />
      <FilterDropdown
        title="City"
        options={filterOptions.cities}
        selectedValues={localFilters.cities}
        onValueChange={(value) => onFilterChange('cities', value)}
        onClearCategory={() => onClearCategory('cities')}
      />
      <FilterDropdown
        title="Firm"
        options={filterOptions.firms}
        selectedValues={localFilters.firms}
        onValueChange={(value) => onFilterChange('firms', value)}
        onClearCategory={() => onClearCategory('firms')}
      />
      <FilterDropdown
        title="Branch"
        options={filterOptions.branches}
        selectedValues={localFilters.branches}
        onValueChange={(value) => onFilterChange('branches', value)}
        onClearCategory={() => onClearCategory('branches')}
      />
      <FilterDropdown
        title="Team"
        options={filterOptions.teams}
        selectedValues={localFilters.teams}
        onValueChange={(value) => onFilterChange('teams', value)}
        onClearCategory={() => onClearCategory('teams')}
      />
      <FilterDropdown
        title="Favorite List"
        options={favoriteListOptions}
        selectedValues={localFilters.favoriteLists}
        onValueChange={(value) => onFilterChange('favoriteLists', value)}
        onClearCategory={() => onClearCategory('favoriteLists')}
      />
      <FilterDropdown
        title="Report"
        options={reportOptions}
        selectedValues={localFilters.reports}
        onValueChange={(value) => onFilterChange('reports', value)}
        onClearCategory={() => onClearCategory('reports')}
      />
    </div>
  );
}
