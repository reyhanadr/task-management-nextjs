import { useState, useCallback } from 'react';
import { userService } from '@/services/users';
import type { User } from '@/types/user';

interface UseUsersReturn {
  users: User[];
  user: User | null;
  loading: boolean;
  error: Error | null;
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: string) => Promise<User | undefined>;
  clearError: () => void;
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchUsers = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await userService.getAll();
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch users'));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserById = useCallback(async (id: string): Promise<User | undefined> => {
    if (!id) {
      setError(new Error('User ID is required'));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data } = await userService.getOne(id);
      
      // Update the specific user in the users array if it exists
      setUsers(prevUsers => {
        const userExists = prevUsers.some(u => u.id === id);
        return userExists 
          ? prevUsers.map(u => u.id === id ? data : u)
          : [...prevUsers, data];
      });
      
      setUser(data);
      return data;
    } catch (err) {
      console.error(`Failed to fetch user with ID ${id}:`, err);
      const error = err instanceof Error ? err : new Error('Failed to fetch user');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    users,
    user,
    loading,
    error,
    fetchUsers,
    fetchUserById,
    clearError,
  };
};
