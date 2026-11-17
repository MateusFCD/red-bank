import { AuthContext } from '@/src/context/AuthContext';
import { createContextHook } from '@/src/hooks/createContextHook';

export const useAuth = createContextHook(AuthContext, 'useAuth');
