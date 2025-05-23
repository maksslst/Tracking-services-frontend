import { Roles } from '../enums/role';

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
