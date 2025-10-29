import api from '@/lib/api';
import type { User } from '@/types/user';

export const userService = {
    getAll: () => 
        api.get<User[]>('/users').then((res) => res.data),
    getById: (id: string) =>
         api.get<User>(`/users/${id}`).then((res) => res.data),
};