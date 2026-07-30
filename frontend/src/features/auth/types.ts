export interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  success: boolean;
}
export interface LoginAction {
  type: string;
  payload: {
    email: string;
    password: string;
  };
}
