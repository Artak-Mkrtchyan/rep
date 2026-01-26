export type AccountRole = '' | 'individual' | 'company' | 'broker';
export interface PasswordRequirements {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasNumber: boolean;
}

export interface BrokerSignUpForm {
  fullName: string;
  email: string;
  attachmentIds: string[];
  certifiedBy: string;
  certifiedOn: string;
  phoneNumber: string;
  yearsOfActivity: number;
}

export interface PasswordForm {
  email: string;
  password: string;
  confirmPassword: string;
}

// API Types
export enum AuthScope {
  SYSTEM = 'SYSTEM',
  ADMIN = 'ADMIN',
  BROKER = 'BROKER',
  BROKER_COMPANY = 'BROKER_COMPANY',
  CONSTRUCTION = 'CONSTRUCTION',
  USUAL = 'USUAL',
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface CreateUsualUserResponse {
  id?: string;
  email?: string;
  fullName?: string;
  message?: string;
}

export interface CreateIndividualBrokerRequest {
  email: string;
  fullName: string;
  phone: string;
  certifiedOn: string;
  certifiedBy: string;
  yearsOfActivity: number;
  files: any[]; // React Native handles files differently (usually object with uri, type, name)
}

export interface CreateBrokerCompanyRequest {
  email: string;
  companyName: string;
  mobileNumber: string;
  focalPointEmail?: string;
  focalPointFullName?: string;
  focalPointMobileNumber?: string;
  certifiedOn: string;
  certifiedBy?: string;
  yearsOfActivity: number;
  files: any[];
}

export interface CreateConstructionCompanyRequest {
  email: string;
  companyName: string;
  mobileNumber: string;
  certifiedOn: string;
  certifiedBy?: string;
  constructionYearsStart: number;
  constructionYearsEnd: number;
  files: any[];
}
