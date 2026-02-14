export interface LoginInterface {
  email: string;
  password: string;
}

export interface ForgotInterface {
  username: string;
  email: string;
}

export interface ResetInterface {
  password: string;
  confirm_password: string;
}

export interface RegisterInterface {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
}
