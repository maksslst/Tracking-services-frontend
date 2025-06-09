import { apiSlice } from './apiSlice';

export type MonitoringSettingDto = {
  id?: number;
  resourceId: number;
  checkInterval: string;
  mode: boolean;
};

export type CreateMonitoringSettingRequest = {
  resourceId: number;
  checkInterval: string;
  mode: boolean;
};

export type CreateMonitoringSettingResponse = {
  id: number;
};

export type UpdateMonitoringSettingRequest = {
  id: number;
  resourceId: number;
  checkInterval: string;
  mode: boolean;
};

export type DeleteMonitoringSettingRequest = {
  monitoringSettingId: number;
};

export type GetMonitoringSettingByResourceIdRequest = {
  resourceId: number;
};

export type GetMonitoringSettingByResourceIdResponse = MonitoringSettingDto;

export const monitoringSettingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createMonitoringSetting: builder.mutation<
      CreateMonitoringSettingResponse,
      CreateMonitoringSettingRequest
    >({
      query: (args) => ({
        url: '/MonitoringSetting',
        method: 'POST',
        body: args,
      }),
      invalidatesTags: ['MonitoringSetting'],
    }),
    updateMonitoringSetting: builder.mutation<
      void,
      UpdateMonitoringSettingRequest
    >({
      query: (args) => ({
        url: '/MonitoringSetting',
        method: 'PUT',
        body: args,
      }),
      invalidatesTags: ['MonitoringSetting'],
    }),
    deleteMonitoringSetting: builder.mutation<
      void,
      DeleteMonitoringSettingRequest
    >({
      query: ({ monitoringSettingId }) => ({
        url: `/MonitoringSetting/${monitoringSettingId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MonitoringSetting'],
    }),
    getMonitoringSettingByResourceId: builder.query<
      GetMonitoringSettingByResourceIdResponse,
      GetMonitoringSettingByResourceIdRequest
    >({
      query: ({ resourceId }) => ({
        url: `/MonitoringSetting/${resourceId}`,
      }),
      providesTags: (result, error, { resourceId }) => [
        { type: 'MonitoringSetting', id: resourceId },
      ],
    }),
  }),
});

export const {
  useCreateMonitoringSettingMutation,
  useUpdateMonitoringSettingMutation,
  useDeleteMonitoringSettingMutation,
  useGetMonitoringSettingByResourceIdQuery,
} = monitoringSettingApiSlice;
