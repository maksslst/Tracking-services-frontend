import { apiSlice } from './apiSlice';
import { Roles } from './enums/role';

export type UserInfoRequest = any;

export type UserInfoResponse = UserDto;

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

export type CreateUserRequest = {
  username: string;
  firstName: string;
  lastName: string;
  patronymic?: string;
  email: string;
  password: string;
  role: Roles;
  companyId?: number;
};

export type UpdateUserRequest = {
  id: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  patronymic?: string;
  email?: string;
  role?: Roles;
  companyId?: number;
  password?: string;
};

export type CreateUserResponse = {
  id: number;
};

export type DeleteUserRequest = {
  userId: number;
};

export type GetUserByIdRequest = {
  userId: number;
};

export type GetAllUsersResponse = UserDto[];

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation<CreateUserResponse, CreateUserRequest>({
      query: (args) => ({
        url: '/User',
        method: 'POST',
        body: args,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation<void, UpdateUserRequest>({
      query: (args) => ({
        url: '/User',
        method: 'PUT',
        body: args,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation<void, DeleteUserRequest>({
      query: ({ userId }) => ({
        url: `/User/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    getUserById: builder.query<UserDto, GetUserByIdRequest>({
      query: ({ userId }) => ({
        url: `/User/${userId}`,
      }),
      providesTags: (result, error, { userId }) => [
        { type: 'User', id: userId },
      ],
    }),
    getAllUsers: builder.query<GetAllUsersResponse, void>({
      query: () => ({
        url: '/User',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),
    userInfo: builder.query<UserInfoResponse, UserInfoRequest>({
      query: () => ({
        url: '/User/UserInfo',
      }),
      providesTags: ['User'],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserByIdQuery,
  useGetAllUsersQuery,
  useUserInfoQuery,
} = userApiSlice;
