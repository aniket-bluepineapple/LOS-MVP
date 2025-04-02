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
        "http://localhost:5000/api/loan_applications/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            //Add userId/username
            Name: values.firstName + " " + values.lastName, //should have 2 fields
            DOB: values.dob,
            NoOfDependents: values.dependents,
            Email: values.email,
            Phone: values.phone,
            MaritalStatus: values.maritalStatus,

            AadharNo: values.aadhar,
            PAN: values.pan,
            AadharUploadDoc: values.aadharFile,
            PANUploadDoc: values.panFile,
            // AadharVerified: values.is || false, //not required
            // PANVerified: values.isPanVerified || false, //not required

            MonthlyIncome: values.monthlyIncome,
            //Employment Nature and other optional fields

            RoleID: "Consumer",
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
        "http://localhost:5000//api/addresses/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UserID: "", //add this in BE
            Street: values.street,
            City: values.city,
            District: values.district, // add this in BE
            State: values.state,
            Zip: values.pincode,
            AddressType: values.addressType,
            AddressDoc: values.addressProof, //Add this in BE
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
