import { ApiResponse } from './auth.types';
import { httpClient } from './http/client';
import {
  Announcement,
  AnnouncementFullInfoDto,
  ItemsListApiResponse,
  PriceChangeHistory,
  SearchRequest,
} from '@/types/api';
import type {
  AnnouncementListItem,
  AnnouncementStatisticsByStatusResponse,
} from '@/types/my-announcements';

export const announcementsService = {
  getAnnouncementById: async (id: string): Promise<Announcement> => {
    const response = await httpClient.get<ApiResponse<Announcement>>(`/v1/announcements/${id}`, {
      requiresAuth: false,
    });
    return response.data || (response as unknown as Announcement);
  },

  searchAnnouncements: async (
    request: SearchRequest
  ): Promise<ItemsListApiResponse<Announcement>> => {
    const response = await httpClient.post<ApiResponse<ItemsListApiResponse<Announcement>>>(
      '/v1/announcements/search',
      request,
      { requiresAuth: false }
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

  getComparisons: async (
    page: number,
    pageSize: number
  ): Promise<ItemsListApiResponse<Announcement>> => {
    return announcementsService.searchAnnouncements({
      filter: { forComparison: true },
      pagination: { pageNumber: page, pageSize },
      sorts: [{ sort: 'CREATED_AT', direction: 'DESC' }],
    });
  },

  addToComparison: async (id: string): Promise<unknown> => {
    const response = await httpClient.post<ApiResponse<unknown>>(
      `/v1/announcements/${id}/for-comparison`,
      {},
      { requiresAuth: true }
    );
    return response.data || response;
  },

  removeFromComparison: async (id: string): Promise<unknown> => {
    const response = await httpClient.delete<ApiResponse<unknown>>(
      `/v1/announcements/${id}/for-comparison`,
      undefined,
      { requiresAuth: true }
    );
    return response.data || response;
  },

  getAnnouncementsHistory: async (
    data: SearchRequest
  ): Promise<ItemsListApiResponse<PriceChangeHistory>> => {
    const response = await httpClient.post<ApiResponse<ItemsListApiResponse<PriceChangeHistory>>>(
      '/v1/announcements/history/search',
      data,
      {
        requiresAuth: true,
      }
    );
    return response.data || (response as unknown as ItemsListApiResponse<PriceChangeHistory>);
  },

  getMyAnnouncements: async (
    request: SearchRequest
  ): Promise<ItemsListApiResponse<AnnouncementListItem>> => {
    const response = await httpClient.post<ApiResponse<ItemsListApiResponse<AnnouncementListItem>>>(
      '/v1/announcements/search/for-screen/my-announcements',
      request,
      {
        requiresAuth: true,
      }
    );
    return response.data || (response as unknown as ItemsListApiResponse<AnnouncementListItem>);
  },

  getAnnouncementsStatisticsByStatuses: async (
    data: object
  ): Promise<AnnouncementStatisticsByStatusResponse> => {
    const response = await httpClient.post<ApiResponse<AnnouncementStatisticsByStatusResponse>>(
      '/v1/announcements/statistics/by-statuses',
      data,
      {
        requiresAuth: true,
      }
    );
    return response.data || (response as unknown as AnnouncementStatisticsByStatusResponse);
  },

  closeAnnouncement: async (id: string, closureReason: string): Promise<Announcement> => {
    const response = await httpClient.patch<ApiResponse<Announcement>>(
      `/v1/announcements/${id}/close`,
      { closureReason },
      { requiresAuth: true }
    );
    return response.data || (response as unknown as Announcement);
  },

  getAnnouncementFullInfo: async (id: string): Promise<AnnouncementFullInfoDto> => {
    const response = await httpClient.get<ApiResponse<AnnouncementFullInfoDto>>(
      `/v1/announcements/${id}/full-info`,
      { requiresAuth: true }
    );
    return response.data || (response as unknown as AnnouncementFullInfoDto);
  },

  getAddressSuggestions: async (address: string, limit = 10): Promise<string[]> => {
    const response = await httpClient.get<ApiResponse<string[]>>(
      `/v1/announcements/addresses/suggestions?address=${encodeURIComponent(address)}&limit=${limit}`,
      { requiresAuth: false }
    );
    return response.data || (response as unknown as string[]);
  },

  reopenAnnouncement: async (id: string): Promise<Announcement> => {
    const response = await httpClient.patch<ApiResponse<Announcement>>(
      `/v1/announcements/${id}/reopen`,
      {},
      { requiresAuth: true }
    );
    return response.data || (response as unknown as Announcement);
  },
};
