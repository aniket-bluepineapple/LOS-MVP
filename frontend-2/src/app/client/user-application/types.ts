export interface FormValues {
    firstName: string;
    lastName: string;
    dob: string;
    aadhar: string;
    pan: string;
    aadharFile: File | null;
    panFile: File | null;
    phone: string;
    email: string;
    dependents: string
    maritalStatus: string;
    monthlyIncome: string;
    incomeProof: File | null;
    addressProof: File | null;
    street: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
}

export type UserApplicationProps ={
    data: {
        [key: string]: any
      }
}