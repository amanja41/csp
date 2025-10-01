import { create } from 'zustand';

type Agent = {
  active: boolean;
  basic_handle: string | null;
  basic_name: string | null;
  basic_permissions: string[] | null;
  basic_role: string[] | null;
  email: string;
  first_name: string;
  id: number | null;
  last_login_at: string | null;
  last_name: string;
  name: string;
  okta_all_permissions: string[];
  okta_app_permissions: string[];
  okta_roles: string[];
};

type AuthState = {
  agent?: Agent;
  login(agent: Agent): void;
};

export const useAuthStore = create<AuthState>(set => ({
  agent: undefined,
  login: (agent: Agent) => set({ agent }),
}));
