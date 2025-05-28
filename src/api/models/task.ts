import { TaskStatus } from '../enums/taskStatus';

export type TaskDto = {
  id?: number;
  resourceId?: number;
  description?: string;
  assignedUserId?: number;
  createdById?: number;
  taskStatus?: TaskStatus;
};
