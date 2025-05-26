
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface FilterOptions {
  provinces: string[];
  cities: string[];
  firms: string[];
  branches: string[];
  teams: string[];
  favoriteLists: Array<{ id: string; name: string }>;
  reports: Array<{ id: string; name: string }>;
}

export function useFilterData() {
  const { user } = useAuth();

  // Fetch filter options from the database view
  const { data: filterOptions, isLoading } = useQuery({
    queryKey: ['filter-options'],
    queryFn: async () => {
      console.log('Fetching filter options from database view...');
      
      const { data, error } = await supabase
        .from('advisor_filter_options')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching filter options:', error);
        return { provinces: [], cities: [], firms: [], branches: [], teams: [] };
      }

      console.log('Fetched filter options from view:', {
        provinces: data.provinces?.length || 0,
        cities: data.cities?.length || 0,
        firms: data.firms?.length || 0,
        branches: data.branches?.length || 0,
        teams: data.teams?.length || 0,
      });

      return {
        provinces: data.provinces || [],
        cities: data.cities || [],
        firms: data.firms || [],
        branches: data.branches || [],
        teams: data.teams || [],
      };
    },
  });

  // Fetch user's favorite lists
  const { data: favoriteLists = [] } = useQuery({
    queryKey: ['favorite-lists', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('favorite_lists')
        .select('id, name')
        .eq('user_id', user.id)
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error fetching favorite lists:', error);
        return [];
      }
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch user's reports
  const { data: reports = [] } = useQuery({
    queryKey: ['user-reports', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('reports')
        .select('id, name')
        .eq('user_id', user.id)
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error fetching reports:', error);
        return [];
      }
      return data;
    },
    enabled: !!user?.id,
  });

  const combinedFilterOptions: FilterOptions = {
    provinces: filterOptions?.provinces || [],
    cities: filterOptions?.cities || [],
    firms: filterOptions?.firms || [],
    branches: filterOptions?.branches || [],
    teams: filterOptions?.teams || [],
    favoriteLists: favoriteLists || [],
    reports: reports || []
  };

  return {
    filterOptions: combinedFilterOptions,
    isLoading
  };
}
