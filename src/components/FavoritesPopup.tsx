
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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

interface FavoritesPopupProps {
  advisor: Advisor;
  isOpen: boolean;
  onClose: () => void;
}

export function FavoritesPopup({ advisor, isOpen, onClose }: FavoritesPopupProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [selectedListId, setSelectedListId] = useState<string>('');

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
    enabled: !!user?.id && isOpen,
  });

  // Create new favorite list
  const createListMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !newListName.trim()) return;
      const { data, error } = await supabase
        .from('favorite_lists')
        .insert({
          user_id: user.id,
          name: newListName.trim(),
          description: newListDescription.trim() || null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data) {
        setSelectedListId(data.id);
        setNewListName('');
        setNewListDescription('');
        setShowCreateForm(false);
        queryClient.invalidateQueries({ queryKey: ['favorite-lists'] });
        toast.success('Favorite list created successfully!');
      }
    },
    onError: () => {
      toast.error('Failed to create favorite list');
    },
  });

  // Add advisor to favorite list
  const addToListMutation = useMutation({
    mutationFn: async (listId: string) => {
      const { error } = await supabase
        .from('favorite_list_items')
        .insert({
          favorite_list_id: listId,
          advisor_id: advisor.id,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Advisor added to favorites!');
      onClose();
    },
    onError: () => {
      toast.error('Failed to add advisor to favorites');
    },
  });

  const handleCreateAndAdd = () => {
    createListMutation.mutate();
  };

  const handleAddToExisting = () => {
    if (selectedListId) {
      addToListMutation.mutate(selectedListId);
    }
  };

  const handleCreateListSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createListMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Favorites</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-slate-600">
            Adding: <span className="font-medium">{advisor.first_name} {advisor.last_name}</span>
          </div>

          {!showCreateForm ? (
            <>
              {favoriteLists.length > 0 && (
                <div className="space-y-3">
                  <Label>Select existing list:</Label>
                  <Select value={selectedListId} onValueChange={setSelectedListId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a favorite list..." />
                    </SelectTrigger>
                    <SelectContent>
                      {favoriteLists.map((list) => (
                        <SelectItem key={list.id} value={list.id}>
                          {list.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={handleAddToExisting} 
                    disabled={!selectedListId || addToListMutation.isPending}
                    className="w-full"
                  >
                    Add to Selected List
                  </Button>
                </div>
              )}

              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  variant="outline"
                  className="w-full"
                >
                  Create New List
                </Button>
              </div>
            </>
          ) : (
            <form onSubmit={handleCreateListSubmit} className="space-y-4">
              <div>
                <Label htmlFor="listName">List Name *</Label>
                <Input
                  id="listName"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="Enter list name..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="listDescription">Description</Label>
                <Textarea
                  id="listDescription"
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  placeholder="Optional description..."
                  rows={3}
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  type="submit" 
                  disabled={!newListName.trim() || createListMutation.isPending}
                  className="flex-1"
                >
                  Create & Add
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
