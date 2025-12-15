export type AccountRole = '' | 'individual' | 'company' | 'broker';
export type YearsOfActivity = '' | '0-1' | '2-5' | '6-10' | '10+';

export interface PasswordRequirements {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasNumber: boolean;
}

export interface BrokerSignUpForm {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  yearsOfActivity: YearsOfActivity;
  filesCount: number;
}

export interface PasswordForm {
  email: string;
  password: string;
  confirmPassword: string;
}
