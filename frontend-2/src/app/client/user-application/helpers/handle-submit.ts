import { Dispatch, FormEvent, SetStateAction } from "react";
import { validateField } from "./validate-field";
import { FormValues } from "../types";

export const handleSubmit = async (
  e: FormEvent,
  values: FormValues,
  setErrors: Dispatch<SetStateAction<Partial<FormValues>>>,
) => {
  e.preventDefault();
  let isValid = true;

  // List of optional fields that can be empty
  const optionalFields: (keyof FormValues)[] = [
    "companyname",
    "experience",
    "companyaddress",
    "officialEmail",
  ];

  Object.keys(values).forEach((key) => {
    if (
      !values[key as keyof FormValues] &&
      !optionalFields.includes(key as keyof FormValues)
    ) {
      validateField(key as keyof FormValues, "", values, setErrors);
      isValid = false;
    }
  });
  if (isValid) {
    //User Application
    try {
      const userResponse = await fetch(
        "http://127.0.0.1:5000/api/users/",
        {
          method: "POST",
          mode: "cors", // Ensure CORS is enabled
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Name: values.firstName + " " + values.lastName,
            DOB: values.dob,
            NoOfDependents: values.dependents,
            Email: values.email,
            Phone: values.phone,
            MaritalStatus: values.maritalStatus,
            AadharNo: values.aadhar,
            PAN: values.pan,
            AadharUploadDoc: values.aadharFile,
            PANUploadDoc: values.panFile,
            AadharVerified: false, 
            PANVerified:  false, 
            MonthlyIncome: values.monthlyIncome,
            RoleID: 1,
          }),
        },
      );

      //Address fields to be posted

      const data = await userResponse.json();

      if (userResponse.ok) {
        alert("Loan application submitted successfully!");
        console.log("Loan Application Response:", data);
      } else {
        alert(`Error: ${data.message}`);
        console.error("Loan Application Error:", data);
      }
    } catch (error) {
      alert("Failed to submit loan application.");
      console.error("API Request Error:", error);
    }

    //Address Details
    try {
      const addressResponse = await fetch(
        "http://127.0.0.1:5000/api/addresses/",
        {
          method: "POST",
          mode: "cors", // Ensure CORS is enabled
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UserID: 1,
            Street: values.street,
            City: values.city,
            State: values.state,
            Zip: values.pincode,
            AddressType: values.addressType
          }),
        },
      );

      const data = await addressResponse.json();

      if (addressResponse.ok) {
        alert("Address submitted successfully!");
        console.log("Address Application Response:", data);
      } else {
        alert(`Error: ${data.message}`);
        console.error("Address Application Error:", data);
      }
    } catch (error) {
      alert("Failed to submit address application.");
      console.error("API Request Error:", error);
    }
  }
};
