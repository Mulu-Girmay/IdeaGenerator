export interface LoginAction {
  type: string;
  payload: {
    email: string;
    password: string;
  };
}
