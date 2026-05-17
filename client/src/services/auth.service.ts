import api from "./api";
import type { AuthResponse, User } from "../types/user";

export const authService = {
  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  register: async (data: { name: string; email: string; password: string; role: string }): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  // If the server exposes a /auth/me endpoint in the future, use this.
  // For now it's not in the backend routes, so we skip it.
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get("/auth/me");
    return response.data.user;
  },

  logout: async (): Promise<void> => {
    // Tell the server to clear the httpOnly cookie
    await api.post("/auth/logout").catch(() => {
      // Ignore errors — just clear local state regardless
    });
  },
};
