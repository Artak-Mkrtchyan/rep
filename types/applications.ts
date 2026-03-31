export interface SearchRequest {
  filter?: {
    _and_?: Record<string, unknown>[];
    _or_?: Record<string, unknown>[];
    _not_?: Record<string, unknown>;

    ids?: string[];
    statuses?: string[];
    types?: string[];

    createdAfter?: string;
    createdBefore?: string;
    updatedAfter?: string;
    updatedBefore?: string;

    createdBy?: string;
    reviewerId?: string;
    assigneeId?: string;

    archived?: boolean;
    active?: boolean;

    [key: string]: unknown;
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

export interface SearchResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

// Broker interfaces
export interface BrokerCompany {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phoneNumber: string;
  certifiedOn: string;
  certifiedBy?: string;
  yearsOfActivity: number;
}

export interface IndividualBroker {
  id: string;
  createdAt: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  certifiedOn: string;
  certifiedBy?: string;
  yearsOfActivity: number;
}

export type ApplicationDetails = {
  stepNumber: number;
  assignedBrokerCompanyId?: string;
  assignedBrokerId?: string;
  //  Optional detailed info about assigned broker and company for easier access in the form, used to display broker info in the UI
  assignedBroker?: IndividualBroker;
  assignedBrokerCompany?: BrokerCompany;
};

export interface AssignBrokerRequest {
  brokerCompanyId?: string;
  brokerId?: string;
}
