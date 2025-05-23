import { ResourceStatus } from '../enums/resourceStatus';

export type ResourceDto = {
  id?: number;
  name?: string;
  type?: string;
  source?: string;
  companyId?: number;
  resourceStatus?: ResourceStatus;
};
