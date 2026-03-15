import { ApiResponse } from './auth.types';
import { httpClient } from './http/client';
import { Announcement, ItemsListApiResponse, SearchRequest } from '@/types/api';

export const announcementsService = {
  searchAnnouncements: async (
    request: SearchRequest
  ): Promise<ItemsListApiResponse<Announcement>> => {
    const response = await httpClient.post<ApiResponse<ItemsListApiResponse<Announcement>>>(
      '/v1/announcements/search',
      request,
      { requiresAuth: true }
    );
    return response.data || (response as unknown as ItemsListApiResponse<Announcement>);
  },

  getFavourites: async (
    page: number,
    pageSize: number
  ): Promise<ItemsListApiResponse<Announcement>> => {
    return announcementsService.searchAnnouncements({
      filter: { favourite: true },
      pagination: { pageNumber: page, pageSize },
      sorts: [{ sort: 'CREATED_AT', direction: 'DESC' }],
    });
  },

  addToFavourites: async (id: string): Promise<unknown> => {
    const response = await httpClient.post<ApiResponse<unknown>>(
      `/v1/announcements/${id}/favourite`,
      {},
      { requiresAuth: true }
    );
    return response.data || response;
  },

  removeFromFavourites: async (id: string): Promise<unknown> => {
    const response = await httpClient.delete<ApiResponse<unknown>>(
      `/v1/announcements/${id}/favourite`,
      undefined,
      { requiresAuth: true }
    );
    return response.data || response;
  },
};
