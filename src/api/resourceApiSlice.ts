import { apiSlice } from './apiSlice';
import { ResourceStatus } from './enums/resourceStatus';

export type ResourceDto = {
  id?: number;
  name?: string;
  type?: string;
  source?: string;
  companyId?: number;
  resourceStatus?: ResourceStatus;
};

export type CreateResourceRequest = {
  name: string;
  type: string;
  source: string;
  companyId: number;
  status?: ResourceStatus;
};

export type CreateResourceResponse = {
  id: number;
};

export type UpdateResourceRequest = {
  id: number;
  companyId?: number | null;
  name: string;
  type: string;
  source: string;
  status: string;
};

export type AddCompanyResourceRequest = {
  companyId: number;
  resource: CreateResourceRequest;
};

export type UpdateCompanyResourceRequest = {
  companyId: number;
  resourceId: number;
  resource: UpdateResourceRequest;
};

export type DeleteCompanyResourceRequest = {
  resourceId: number;
  companyId: number;
};

export type GetAllResourcesResponse = ResourceDto[];

export type GetCompanyResourcesRequest = {
  companyId: number;
};

export type GetCompanyResourcesResponse = ResourceDto[];

export const resourceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Создание ресурса (POST /Resource)
    createResource: builder.mutation<
      CreateResourceResponse,
      CreateResourceRequest
    >({
      query: (args) => ({
        url: '/Resource',
        method: 'POST',
        body: args,
      }),
      invalidatesTags: ['Resource'],
    }),
    addCompanyResource: builder.mutation<void, AddCompanyResourceRequest>({
      query: ({ companyId, resource }) => ({
        url: `/Resource/${companyId}`,
        method: 'POST',
        body: resource,
      }),
      invalidatesTags: ['Resource'],
    }),
    updateCompanyResource: builder.mutation<void, UpdateCompanyResourceRequest>(
      {
        query: ({ companyId, resourceId, resource }) => ({
          url: `/Resource/${companyId}/${resourceId}`,
          method: 'PUT',
          body: resource,
        }),
        invalidatesTags: ['Resource'],
      }
    ),
    deleteCompanyResource: builder.mutation<void, DeleteCompanyResourceRequest>(
      {
        query: ({ resourceId, companyId }) => ({
          url: `/Resource/${resourceId}/${companyId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Resource'],
      }
    ),
    getAllResources: builder.query<GetAllResourcesResponse, void>({
      query: () => ({
        url: '/Resource',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Resource' as const, id })),
              { type: 'Resource', id: 'LIST' },
            ]
          : [{ type: 'Resource', id: 'LIST' }],
    }),
    getCompanyResources: builder.query<
      GetCompanyResourcesResponse,
      GetCompanyResourcesRequest
    >({
      query: ({ companyId }) => ({
        url: `/Resource/GetCompanyResources/${companyId}`,
      }),
      providesTags: (result, error, { companyId }) => [
        { type: 'Resource', id: companyId },
      ],
    }),
  }),
});

export const {
  useCreateResourceMutation,
  useAddCompanyResourceMutation,
  useUpdateCompanyResourceMutation,
  useDeleteCompanyResourceMutation,
  useGetAllResourcesQuery,
  useGetCompanyResourcesQuery,
} = resourceApiSlice;

export { ResourceStatus };
