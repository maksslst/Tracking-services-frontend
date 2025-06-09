import { apiSlice } from './apiSlice';

export type LoginRequest = {
  username: string;
  password: string;
};

export type RegisterRequest = {
  username: string;
  firstName: string;
  lastName: string;
  patronymic: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<void, LoginRequest>({
      query: (args) => ({
        url: '/Auth/login',
        method: 'POST',
        body: args,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error(error);
        }
      },
      invalidatesTags: ['User'],
    }),
    register: builder.mutation<void, RegisterRequest>({
      query: (args) => ({
        url: '/Auth/register',
        method: 'POST',
        body: args,
      }),
      invalidatesTags: ['User'],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/Auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } =
  authApiSlice;
