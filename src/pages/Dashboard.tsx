
import { useAuth } from '@/contexts/AuthContext';
import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { AdvisorTable } from '@/components/AdvisorTable';
import { FilterPanel } from '@/components/FilterPanel';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

type SortField = 'first_name' | 'last_name' | 'firm' | 'city' | 'province' | 'title' | 'branch' | 'team_name';
type SortDirection = 'asc' | 'desc';

interface SelectedFilters {
  provinces: string[];
  cities: string[];
  firms: string[];
  branches: string[];
  teams: string[];
  favoriteLists: string[];
  reports: string[];
}

export default function Dashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [sortField, setSortField] = useState<SortField>('first_name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    provinces: [],
    cities: [],
    firms: [],
    branches: [],
    teams: [],
    favoriteLists: [],
    reports: []
  });

  // Fetch user profile data to get first name
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch favorite list IDs for the selected favorite lists
  const { data: favoriteListIds = [] } = useQuery({
    queryKey: ['favorite-list-ids', selectedFilters.favoriteLists, user?.id],
    queryFn: async () => {
      if (!user?.id || selectedFilters.favoriteLists.length === 0) return [];
      
      const { data, error } = await supabase
        .from('favorite_lists')
        .select('id')
        .eq('user_id', user.id)
        .in('name', selectedFilters.favoriteLists);
      
      if (error) {
        console.error('Error fetching favorite list IDs:', error);
        return [];
      }
      
      return data.map(list => list.id);
    },
    enabled: !!user?.id && selectedFilters.favoriteLists.length > 0,
  });

  // Fetch advisor IDs from favorite lists
  const { data: favoriteAdvisorIds = [] } = useQuery({
    queryKey: ['favorite-advisor-ids', favoriteListIds],
    queryFn: async () => {
      if (favoriteListIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from('favorite_list_items')
        .select('advisor_id')
        .in('favorite_list_id', favoriteListIds);
      
      if (error) {
        console.error('Error fetching favorite advisor IDs:', error);
        return [];
      }
      
      return data.map(item => item.advisor_id);
    },
    enabled: favoriteListIds.length > 0,
  });

  // Fetch advisor IDs from selected reports
  const { data: reportAdvisorIds = [] } = useQuery({
    queryKey: ['report-advisor-ids', selectedFilters.reports, user?.id],
    queryFn: async () => {
      if (!user?.id || selectedFilters.reports.length === 0) return [];
      
      const { data, error } = await supabase
        .from('reports')
        .select('advisor_ids')
        .eq('user_id', user.id)
        .in('name', selectedFilters.reports);
      
      if (error) {
        console.error('Error fetching report advisor IDs:', error);
        return [];
      }
      
      // Flatten all advisor IDs from all selected reports
      const allAdvisorIds = data.flatMap(report => report.advisor_ids);
      return [...new Set(allAdvisorIds)]; // Remove duplicates
    },
    enabled: !!user?.id && selectedFilters.reports.length > 0,
  });

  // Fetch total count of advisors (filtered by search and filters)
  const { data: totalCount } = useQuery({
    queryKey: ['advisors-count', searchQuery, selectedFilters, favoriteAdvisorIds, reportAdvisorIds],
    queryFn: async () => {
      let query = supabase
        .from('advisors')
        .select('*', { count: 'exact', head: true });

      // Apply search filter
      if (searchQuery.trim()) {
        query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`);
      }

      // Apply category filters
      if (selectedFilters.provinces.length > 0) {
        query = query.in('province', selectedFilters.provinces);
      }
      if (selectedFilters.cities.length > 0) {
        query = query.in('city', selectedFilters.cities);
      }
      if (selectedFilters.firms.length > 0) {
        query = query.in('firm', selectedFilters.firms);
      }
      if (selectedFilters.branches.length > 0) {
        query = query.in('branch', selectedFilters.branches);
      }
      if (selectedFilters.teams.length > 0) {
        query = query.in('team_name', selectedFilters.teams);
      }
      
      // Apply favorites filter
      if (selectedFilters.favoriteLists.length > 0 && favoriteAdvisorIds.length > 0) {
        query = query.in('id', favoriteAdvisorIds);
      } else if (selectedFilters.favoriteLists.length > 0 && favoriteAdvisorIds.length === 0) {
        // If favorite lists are selected but no advisors found, return 0
        return 0;
      }

      // Apply reports filter
      if (selectedFilters.reports.length > 0 && reportAdvisorIds.length > 0) {
        query = query.in('id', reportAdvisorIds);
      } else if (selectedFilters.reports.length > 0 && reportAdvisorIds.length === 0) {
        // If reports are selected but no advisors found, return 0
        return 0;
      }
      
      const { count, error } = await query;
      
      if (error) {
        console.error('Error fetching advisor count:', error);
        return 0;
      }
      return count || 0;
    },
  });

  // Fetch advisors data with infinite scroll, search, and filters
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['advisors', sortField, sortDirection, searchQuery, selectedFilters, favoriteAdvisorIds, reportAdvisorIds],
    queryFn: async ({ pageParam = 0 }) => {
      console.log('Fetching page starting at:', pageParam, 'with search:', searchQuery, 'and filters:', selectedFilters);
      const from = pageParam;
      const to = pageParam === 0 ? 39 : pageParam + 99; // First page: 40 rows, subsequent: 100 rows
      
      let query = supabase
        .from('advisors')
        .select('*')
        .order(sortField, { ascending: sortDirection === 'asc' })
        .range(from, to);

      // Apply search filter
      if (searchQuery.trim()) {
        query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`);
      }

      // Apply category filters
      if (selectedFilters.provinces.length > 0) {
        query = query.in('province', selectedFilters.provinces);
      }
      if (selectedFilters.cities.length > 0) {
        query = query.in('city', selectedFilters.cities);
      }
      if (selectedFilters.firms.length > 0) {
        query = query.in('firm', selectedFilters.firms);
      }
      if (selectedFilters.branches.length > 0) {
        query = query.in('branch', selectedFilters.branches);
      }
      if (selectedFilters.teams.length > 0) {
        query = query.in('team_name', selectedFilters.teams);
      }
      
      // Apply favorites filter
      if (selectedFilters.favoriteLists.length > 0 && favoriteAdvisorIds.length > 0) {
        query = query.in('id', favoriteAdvisorIds);
      } else if (selectedFilters.favoriteLists.length > 0 && favoriteAdvisorIds.length === 0) {
        // If favorite lists are selected but no advisors found, return empty array
        return [];
      }

      // Apply reports filter
      if (selectedFilters.reports.length > 0 && reportAdvisorIds.length > 0) {
        query = query.in('id', reportAdvisorIds);
      } else if (selectedFilters.reports.length > 0 && reportAdvisorIds.length === 0) {
        // If reports are selected but no advisors found, return empty array
        return [];
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching advisors:', error);
        return [];
      }
      console.log('Fetched data:', data?.length, 'rows');
      return data || [];
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined;
      
      // Calculate the next starting point
      if (allPages.length === 1) {
        // First page had 40 items, next should start at 40
        return lastPage.length < 40 ? undefined : 40;
      } else {
        // Subsequent pages have 100 items each
        const nextStart = 40 + (allPages.length - 1) * 100;
        return lastPage.length < 100 ? undefined : nextStart;
      }
    },
    initialPageParam: 0,
  });

  // Flatten all pages into a single array
  const advisors = data?.pages.flatMap(page => page) || [];
  const currentAdvisorIds = advisors.map(advisor => advisor.id);

  // Add mutation for saving reports
  const saveReportMutation = useMutation({
    mutationFn: async ({ name, description, filters, advisorIds }: {
      name: string;
      description: string;
      filters: SelectedFilters;
      advisorIds: string[];
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('reports')
        .insert({
          user_id: user.id,
          name,
          description,
          search_filters: filters as any, // Cast to any to satisfy Json type
          advisor_ids: advisorIds
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate reports queries if they exist
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleApplyFilters = (filters: SelectedFilters) => {
    setSelectedFilters(filters);
  };

  const handleSaveAsReport = async (name: string, description: string, filters: SelectedFilters, advisorIds: string[]) => {
    await saveReportMutation.mutateAsync({ name, description, filters, advisorIds });
  };

  // Check if filters are applied (to show save as report button)
  const hasAppliedFilters = Object.values(selectedFilters).some(filters => filters.length > 0) || searchQuery.trim() !== '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <DashboardHeader profile={profile} />

      {/* Main Content - Wider container */}
      <main className="px-4 lg:px-8 pb-12 pt-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Advisors Database</h2>
            <p className="text-slate-600 mb-4">Browse and sort through all advisors in your database</p>
            
            {/* Search Input */}
            <div className="relative max-w-md mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by first or last name..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 bg-white border-slate-200 focus:border-slate-400 focus:ring-slate-400"
              />
            </div>

            {/* Filter Panel */}
            <FilterPanel
              onApplyFilters={handleApplyFilters}
              selectedFilters={selectedFilters}
              onSaveAsReport={handleSaveAsReport}
              showSaveAsReport={hasAppliedFilters}
              currentAdvisorIds={currentAdvisorIds}
            />
          </div>
          
          {isLoading ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
              <p className="text-slate-600 font-medium">Loading advisors...</p>
            </div>
          ) : (
            <AdvisorTable
              advisors={advisors}
              onSort={handleSort}
              sortField={sortField}
              sortDirection={sortDirection}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              totalCount={totalCount || 0}
              displayedCount={advisors.length}
            />
          )}
        </div>
      </main>
    </div>
  );
}
