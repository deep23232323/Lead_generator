import api from "./api";
import type { Lead, LeadFilters, LeadsResponse } from "../types/lead";

export const leadService = {
  getLeads: async (filters: LeadFilters): Promise<LeadsResponse> => {
    const params = new URLSearchParams();
    
    if (filters.status) params.append("status", filters.status);
    if (filters.source) params.append("source", filters.source);
    if (filters.search) params.append("search", filters.search);
    if (filters.sortBy) params.append("sort", filters.sortBy);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    const response = await api.get(`/leads?${params.toString()}`);
    return response.data;
  },

  getLeadById: async (id: string): Promise<Lead> => {
    const response = await api.get(`/leads/${id}`);
    return response.data.lead || response.data;
  },

  createLead: async (data: Partial<Lead>): Promise<Lead> => {
    const response = await api.post("/leads", data);
    return response.data.lead || response.data;
  },

  updateLead: async (id: string, data: Partial<Lead>): Promise<Lead> => {
    const response = await api.put(`/leads/${id}`, data);
    return response.data.lead || response.data;
  },

  deleteLead: async (id: string): Promise<void> => {
    await api.delete(`/leads/${id}`);
  }
};
