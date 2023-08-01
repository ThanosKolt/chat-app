export interface LoginRequest {
  username?: string | null;
  password?: string | null;
}

export interface ErrorResponse {
  error: {
    msg: string;
  };
}

export interface User {
  id: number;
  username: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginResponse {
  user: {
    id: number;
    username: string;
  };
  token: string;
}
