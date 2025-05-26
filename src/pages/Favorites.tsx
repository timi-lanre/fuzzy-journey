import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { FavoritesHeader } from '@/components/FavoritesHeader';
import { FavoriteListsView } from '@/components/FavoriteListsView';
import { FavoriteAdvisorsView } from '@/components/FavoriteAdvisorsView';

type SortField = 'first_name' | 'last_name' | 'firm' | 'city' | 'province' | 'title' | 'branch' | 'team_name';
type SortDirection = 'asc' | 'desc';

export default function Favorites() {
  const { user } = useAuth();
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [selectedListName, setSelectedListName] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('first_name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Fetch user's favorite lists
  const { data: favoriteLists = [] } = useQuery({
    queryKey: ['favorite-lists', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('favorite_lists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch count for each list
  const { data: listCounts = {} } = useQuery({
    queryKey: ['favorite-list-counts', favoriteLists.map(l => l.id)],
    queryFn: async () => {
      const counts: Record<string, number> = {};
      
      for (const list of favoriteLists) {
        const { count, error } = await supabase
          .from('favorite_list_items')
          .select('*', { count: 'exact', head: true })
          .eq('favorite_list_id', list.id);
        
        if (!error) {
          counts[list.id] = count || 0;
        }
      }
      
      return counts;
    },
    enabled: favoriteLists.length > 0,
  });

  // Fetch advisors for selected list with sorting
  const { data: favoriteAdvisors = [] } = useQuery({
    queryKey: ['favorite-list-items', selectedListId, sortField, sortDirection],
    queryFn: async () => {
      if (!selectedListId) return [];
      
      const { data, error } = await supabase
        .from('favorite_list_items')
        .select(`
          id,
          advisor_id,
          advisors!favorite_list_items_advisor_id_fkey (
            id,
            first_name,
            last_name,
            title,
            firm,
            branch,
            team_name,
            city,
            province,
            email,
            linkedin_url,
            website_url
          )
        `)
        .eq('favorite_list_id', selectedListId)
        .order(`advisors(${sortField})`, { ascending: sortDirection === 'asc' });
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedListId,
  });

  const handleSelectList = (listId: string) => {
    const list = favoriteLists.find(l => l.id === listId);
    setSelectedListId(listId);
    setSelectedListName(list?.name || '');
  };

  const handleBackToLists = () => {
    setSelectedListId(null);
    setSelectedListName('');
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="min-h-screen bg-[#E5D3BC]">
      <FavoritesHeader />

      {/* Main Content - Wider container */}
      <main className="px-4 lg:px-8 py-8">
        <div className="max-w-[1600px] mx-auto">
          {!selectedListId ? (
            <FavoriteListsView
              favoriteLists={favoriteLists}
              listCounts={listCounts}
              onSelectList={handleSelectList}
            />
          ) : (
            <FavoriteAdvisorsView
              selectedListId={selectedListId}
              selectedListName={selectedListName}
              favoriteAdvisors={favoriteAdvisors}
              onBackToLists={handleBackToLists}
              onSort={handleSort}
              sortField={sortField}
              sortDirection={sortDirection}
            />
          )}
        </div>
      </main>
    </div>
  );
}
