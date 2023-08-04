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

export interface GetRoomsByUserReponse {
  roomId: number;
  user: {
    id: number;
    username: string;
  };
}

export interface GetRoomInfoResponse {
  roomId: number;
  users: Array<{
    id: number;
    username: string;
  }>;
}
