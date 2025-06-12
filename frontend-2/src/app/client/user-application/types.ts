export interface FormValues {
  firstName: string;
  lastName: string;
  dob: string;
  phone: string;
  email: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  dependents: string;
  maritalStatus: string;

  street: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  addressType: string;
  monthlyRent: string;
  addressProof: File | null;

  aadhar: string;
  pan: string;
  aadharFile: File | null;
  panFile: File | null;

  employmentType: string;
  employmentNature: string;
  monthlyIncome: string;
  otherMonthlyEmi: string;
  incomeProof: File | null;
  companyname: string;
  companyaddress: string;
  experience: string;
  officialEmail: string;
}

export type UserApplicationProps = {
  data: {
    [key: string]: string;
  };
};

export const defaultFormValues = {
  firstName: "",
  lastName: "",
  dob: "",
  phone: "",
  email: "",
  isEmailVerified: false,
  isPhoneVerified: false,
  dependents: "",
  maritalStatus: "",

  street: "",
  city: "",
  district: "",
  state: "",
  pincode: "",
  addressType: "",
  monthlyRent: "",
  addressProof: null,

  aadhar: "",
  pan: "",
  aadharFile: null,
  panFile: null,

  employmentType: "",
  employmentNature: "",
  companyname: "",
  monthlyIncome: "",
  otherMonthlyEmi: "",
  incomeProof: null,
  experience: "",
  companyaddress: "",
  officialEmail: "",
};
