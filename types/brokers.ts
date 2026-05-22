export enum BrokerEmployeePosition {
  MANAGER = 'MANAGER',
  AGENT = 'AGENT',
}

export enum BrokerEmployeeStatus {
  REGISTRATION_INITIATED = 'REGISTRATION_INITIATED',
  ACTIVE = 'ACTIVE',
}

export interface BrokerEmployee {
  id: string;
  companyId: string;
  createdAt: string;
  createdBy: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  position: BrokerEmployeePosition;
  status: BrokerEmployeeStatus;
  bio?: string;
  avatarInfo?: {
    id: string;
    thumbnailUrl: string;
    url: string;
  };
}

export interface BrokerEmployeeFilter {
  fullName?: string;
  email?: string;
  positions?: BrokerEmployeePosition[];
  status?: BrokerEmployeeStatus[];
  createdAt?: {
    min?: string;
    max?: string;
  };
}

export interface CreateBrokerEmployeeRequest {
  companyId: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  position: BrokerEmployeePosition;
}

export interface SearchBrokerEmployeesRequest {
  filter?: {
    companyIds?: string[];
    ids?: string[];
    fullNameContains?: string;
    email?: string;
    positions?: string[];
    statuses?: string[];
    createdAt?: {
      min?: string;
      max?: string;
    };
  };
  pagination?: {
    pageNumber: number;
    pageSize: number;
  };
  sorts?: {
    direction: 'ASC' | 'DESC';
    sort: string;
  }[];
}
