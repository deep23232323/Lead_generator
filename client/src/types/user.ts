export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "sales";
  createdAt?: string;
}

// The server sets the token as an httpOnly cookie and only returns user info in the body
export interface AuthResponse {
  message: string;
  user: User;
}
