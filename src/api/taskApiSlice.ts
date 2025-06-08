import { apiSlice } from './apiSlice';
import { TaskStatus } from './enums/taskStatus';

export type TaskDto = {
  id?: number;
  resourceId?: number;
  description?: string;
  assignedUserId?: number;
  createdById?: number;
  taskStatus?: TaskStatus;
};

export type CreateTaskRequest = {
  resourceId: number;
  description: string;
  assignedUserId: number;
  createdById: number;
  status?: TaskStatus;
};

export type CreateTaskResponse = {
  id: number;
};

export type UpdateTaskRequest = {
  id: number;
  resourceId: number;
  description: string;
  assignedUserId: number;
  status: TaskStatus;
};

export type AssignTaskToUserRequest = {
  userId: number;
  taskId: number;
};

export type ReassignTaskToUserRequest = {
  newUserId: number;
  taskId: number;
};

export type DeleteTaskRequest = {
  taskId: number;
};

export type GetTaskByIdRequest = {
  taskId: number;
};

export type GetTaskByIdResponse = TaskDto;

export type GetAllUserTasksRequest = {
  userId: number;
};

export type GetAllUserTasksResponse = TaskDto[];

export type GetAllCompanyTasksRequest = {
  companyId: number;
};

export type GetAllCompanyTasksResponse = TaskDto[];

export const taskApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTask: builder.mutation<CreateTaskResponse, CreateTaskRequest>({
      query: (args) => ({
        url: '/Task',
        method: 'POST',
        body: args,
      }),
      invalidatesTags: ['Task'],
    }),
    assignTaskToUser: builder.mutation<void, AssignTaskToUserRequest>({
      query: ({ userId, taskId }) => ({
        url: `/Task/AssignTaskToUser/${userId}/${taskId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation<void, UpdateTaskRequest>({
      query: (args) => ({
        url: '/Task',
        method: 'PUT',
        body: args,
      }),
      invalidatesTags: ['Task'],
    }),
    reassignTaskToUser: builder.mutation<void, ReassignTaskToUserRequest>({
      query: ({ newUserId, taskId }) => ({
        url: `/Task/ReassignTaskToUser/${newUserId}/${taskId}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Task'],
    }),
    deleteTask: builder.mutation<void, DeleteTaskRequest>({
      query: ({ taskId }) => ({
        url: `/Task/${taskId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),
    getTaskById: builder.query<GetTaskByIdResponse, GetTaskByIdRequest>({
      query: ({ taskId }) => ({
        url: `/Task/${taskId}`,
      }),
      providesTags: (result, error, { taskId }) => [
        { type: 'Task', id: taskId },
      ],
    }),
    getAllUserTasks: builder.query<
      GetAllUserTasksResponse,
      GetAllUserTasksRequest
    >({
      query: ({ userId }) => ({
        url: `/Task/GetAllUserTasks/${userId}`,
      }),
      providesTags: (result: GetAllUserTasksResponse | undefined) =>
        result
          ? [
              ...result
                .filter(
                  (task): task is TaskDto & { id: number } =>
                    task.id !== undefined
                )
                .map(({ id }) => ({ type: 'Task' as const, id })),
              { type: 'Task', id: 'LIST' },
            ]
          : [{ type: 'Task', id: 'LIST' }],
    }),
    getAllCompanyTasks: builder.query<
      GetAllCompanyTasksResponse,
      GetAllCompanyTasksRequest
    >({
      query: ({ companyId }) => ({
        url: `/Task/GetAllCompanyTasks/${companyId}`,
      }),
      providesTags: (result: GetAllCompanyTasksResponse | undefined) =>
        result
          ? [
              ...result
                .filter(
                  (task): task is TaskDto & { id: number } =>
                    task.id !== undefined
                )
                .map(({ id }) => ({ type: 'Task' as const, id })),
              { type: 'Task', id: 'LIST' },
            ]
          : [{ type: 'Task', id: 'LIST' }],
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useAssignTaskToUserMutation,
  useUpdateTaskMutation,
  useReassignTaskToUserMutation,
  useDeleteTaskMutation,
  useGetTaskByIdQuery,
  useGetAllUserTasksQuery,
  useGetAllCompanyTasksQuery,
} = taskApiSlice;
