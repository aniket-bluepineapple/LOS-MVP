export interface FormValues {
  firstName: string;
  lastName: string;
  dob: string;
  phone: string;
  email: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  dependents: string;
  existingEmis: string;
  maritalStatus: string;

  street: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  addressType: string;
  monthlyHomeRent: string;
  addressProof: File | null;

  aadhar: string;
  pan: string;
  aadharFile: File | null;
  panFile: File | null;

  employmentNature: string;
  monthlyIncome: string;
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
  existingEmis: "",
  maritalStatus: "",

  street: "",
  city: "",
  district: "",
  state: "",
  pincode: "",
  addressType: "",
  monthlyHomeRent: "",
  addressProof: null,

  aadhar: "",
  pan: "",
  aadharFile: null,
  panFile: null,

  employmentNature: "",
  companyname: "",
  monthlyIncome: "",
  incomeProof: null,
  experience: "",
  companyaddress: "",
  officialEmail: "",
};
