import { Dispatch, FormEvent, SetStateAction } from "react";
import { validateField } from "./validate-field";
import { FormValues } from "../types";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/constants/layout";


export const handleSubmit = async (
  e: FormEvent,
  values: FormValues,
  setErrors: Dispatch<SetStateAction<Partial<FormValues>>>,
  router: ReturnType<typeof useRouter>
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

  if (!isValid) return;

  const formData = new FormData();
  const appendIfExists = (key: string, value: File | null) => {
    if (value) formData.append(key, value);
  };

  formData.append("FirstName", values.firstName);
  formData.append("LastName", values.lastName);
  formData.append("DOB", values.dob);
  formData.append("NoOfDependents", values.dependents);
  formData.append("Email", values.email);
  formData.append("OfficialEmail", values.officialEmail);
  formData.append("PhoneVerified", values.isPhoneVerified ? "true" : "false");
  formData.append("EmailVerified", values.isEmailVerified ? "true" : "false");
  formData.append("Phone", values.phone);
  formData.append("MaritalStatus", values.maritalStatus);
  formData.append("AadharNo", values.aadhar);
  formData.append("PAN", values.pan);
  formData.append("MonthlyIncome", values.monthlyIncome);
  formData.append("WorkExperience", values.experience);
  formData.append("EmploymentNature", values.employmentNature);
  formData.append("CompanyName", values.companyname);
  formData.append("CompanyAddress", values.companyaddress);
  formData.append("RoleID", "3");

  // Append file uploads
  appendIfExists("AadharUploadDoc", values.aadharFile);
  appendIfExists("PANUploadDoc", values.panFile);
  appendIfExists("IncomeProofDoc", values.incomeProof);

  try {
    const userResponse = await fetch(`${BACKEND_URL}/api/users/`, {
      method: "POST",
      mode: "cors",
      body: formData,
    });

    const userData = await userResponse.json();
    if (!userResponse.ok)
      throw new Error(userData.message || "User creation failed");

    const userId = userData?.user?.UserID;
    if (!userId) throw new Error("User ID not found in response");

    const addressPayload = {
      UserID: userId,
      Street: values.street,
      City: values.city,
      State: values.state,
      Zip: values.pincode,
      AddressType: values.addressType,
    };

    //Address Details

    const addressResponse = await fetch(
      `${BACKEND_URL}/api/addresses/`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressPayload),
      },
    );

    const addressData = await addressResponse.json();
    if (!addressResponse.ok)
      throw new Error(addressData.message || "Address submission failed");
    console.log("Address submitted successfully:", addressData);

    alert("Loan application submitted successfully!");

    // Redirect to login page
    router.push("/login");

  } catch (error) {
    console.error("API Request Error:", error);
  }
};
