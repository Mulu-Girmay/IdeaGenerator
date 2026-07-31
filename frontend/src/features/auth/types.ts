export interface User {
  _id: string;
  username: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
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

export interface LoginResponse {
  user: User;
  token: string;
}
