import { apiSlice } from './apiSlice';
import { Roles } from './enums/role';

export type CompanyDto = {
  id?: number;
  companyName?: string;
};

export type UserDto = {
  id?: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  patronymic?: string;
  email?: string;
  role?: Roles;
  companyId?: number;
};

export type CreateCompanyRequest = {
  companyName: string;
};

export type CreateCompanyResponse = {
  id: number;
};

export type UpdateCompanyRequest = {
  id: number;
  companyName?: string;
};

export type DeleteCompanyRequest = {
  companyId: number;
};

export type AddUserToCompanyRequest = {
  userId: number;
  companyId: number;
};

export type DeleteUserFromCompanyRequest = {
  userId: number;
  companyId: number;
};

export type GetCompanyByIdRequest = {
  companyId: number;
};

export type GetCompanyByIdResponse = CompanyDto;

export type GetAllCompaniesResponse = CompanyDto[];

export type GetCompanyUsersRequest = {
  companyId: number;
};

export type GetCompanyUsersResponse = UserDto[];

export const companyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCompany: builder.mutation<
      CreateCompanyResponse,
      CreateCompanyRequest
    >({
      query: (args) => ({
        url: '/Company',
        method: 'POST',
        body: args,
      }),
      invalidatesTags: ['Company'],
    }),
    addUserToCompany: builder.mutation<void, AddUserToCompanyRequest>({
      query: ({ userId, companyId }) => ({
        url: `/Company/AddUserToCompany/${userId}/${companyId}`,
        method: 'POST',
      }),
      invalidatesTags: ['User', 'Company'],
    }),
    updateCompany: builder.mutation<void, UpdateCompanyRequest>({
      query: (args) => ({
        url: '/Company',
        method: 'PUT',
        body: args,
      }),
      invalidatesTags: ['Company'],
    }),
    deleteCompany: builder.mutation<void, DeleteCompanyRequest>({
      query: ({ companyId }) => ({
        url: `/Company/${companyId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Company'],
    }),
    deleteUserFromCompany: builder.mutation<void, DeleteUserFromCompanyRequest>(
      {
        query: ({ userId, companyId }) => ({
          url: `/Company/DeleteUserFromCompany/${userId}/${companyId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['User', 'Company'],
      }
    ),
    getCompanyById: builder.query<
      GetCompanyByIdResponse,
      GetCompanyByIdRequest
    >({
      query: ({ companyId }) => ({
        url: `/Company/${companyId}`,
      }),
      providesTags: (result, error, { companyId }) => [
        { type: 'Company', id: companyId },
      ],
    }),
    getAllCompanies: builder.query<GetAllCompaniesResponse, void>({
      query: () => ({
        url: '/Company',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Company' as const, id })),
              { type: 'Company', id: 'LIST' },
            ]
          : [{ type: 'Company', id: 'LIST' }],
    }),
    getCompanyUsers: builder.query<
      GetCompanyUsersResponse,
      GetCompanyUsersRequest
    >({
      query: ({ companyId }) => ({
        url: `/Company/GetCompanyUsers/${companyId}`,
      }),
      providesTags: (result, error, { companyId }) => [
        { type: 'User', id: companyId },
      ],
    }),
  }),
});

export const {
  useCreateCompanyMutation,
  useAddUserToCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
  useDeleteUserFromCompanyMutation,
  useGetCompanyByIdQuery,
  useGetAllCompaniesQuery,
  useGetCompanyUsersQuery,
} = companyApiSlice;
