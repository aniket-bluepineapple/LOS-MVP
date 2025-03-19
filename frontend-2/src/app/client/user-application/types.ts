export interface FormValues {
    firstName: string;
    lastName: string;
    dob: string;
    phone: string;
    email: string;
    dependents: string
    maritalStatus: string;
    address: string;
    addressProof: File | null;

    aadhar: string;
    pan: string;
    aadharFile: File | null;
    panFile: File | null;

    employmentNature:string;
    monthlyIncome: string;
    incomeProof: File | null;
    companyname: string
    companyaddress: string
    experience: string
    officialEmail: string
}

export type UserApplicationProps ={
    data: {
        [key: string]: any
      }
}

export const defaultFormValues = {
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
    email: "",
    dependents:'',
    maritalStatus: "",
    address:'',
    addressProof:  null,

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
    officialEmail: ""
  }