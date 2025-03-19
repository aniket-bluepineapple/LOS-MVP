import { Dispatch, SetStateAction } from "react";
import { FormValues } from "./types";
import { AADHAR_REGEX, ALPA_REGEX, EMAIL_REGEX, NUMBER_REGEX, PAN_REGEX, PHONE_REGEX, PINCODE_REGEX } from "./constants";

export const validateField = (
name: keyof FormValues, 
inputValue: string,
values:FormValues, 
setErrors: Dispatch<SetStateAction<Partial<FormValues>>>
) => {
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 60);
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() - 18);

    let error = "";

    const value = inputValue?.trim()

    switch (name) {
      //Personal Details
      case "firstName":
        if(!value){
            error = "Please enter a valid first name";
        }
        else if (!ALPA_REGEX.exec(value)) {
          error = "Only alphabets are allowed";
        }
        break;
      case "lastName":
        if(!value){
            error = "Please enter a valid last name";
        }
        else if (!ALPA_REGEX.exec(value)) {
          error = "Only alphabets are allowed";
        }
        break;
      case "dob":
        if (!value) {
          error = "Please select Date of Birth";
        } else{
          const selectedDate = new Date(value);
          if (selectedDate > maxDate || selectedDate < minDate) {
            error = "User must be at least 18 years old and less than 60 years old";
          }
        }
        break;
        case "phone":
          if (!PHONE_REGEX.exec(value)) {
            error = "Please enter a 10 digit valid Phone number";
          } 
          break;
        case "email":
          if (!EMAIL_REGEX.exec(value)) {
              error = "Please enter a valid Email";
          } 
          break;
        case 'maritalStatus':
          if (!value) {
              error = "Please select marital status";
          }
          break;
        case 'dependents':
            if (!NUMBER_REGEX.exec(value)) {
              error = "Please enter number of dependents";
           }
           break;
        case 'address':
          if (!value) {
              error = "Please enter address";
          } else if(!PINCODE_REGEX.exec(value)){
            error = "Please enter a valid pincode"
          }
        break;

        // KYC
      case "aadhar":
        if (!AADHAR_REGEX.exec(value)) {
          error = "Please enter 12-digit valid aadhar number";
        }
        break;
      case "pan":
        if (!PAN_REGEX.exec(value) || values.lastName && value[4] !== values.lastName[0].toUpperCase()) {
          error = "Please enter a valid PAN number";
        } 
        break;

       // Employment Details
        case 'employmentNature':
        if (!value) {
            error = "Please select employment nature";
        }
        break;
      case 'monthlyIncome':
        if (!NUMBER_REGEX.exec(value)) {
            error = "Please enter valid amount";
        }
        break;
      case 'companyname':
        break;
      case 'companyaddress':
        if(value && !PINCODE_REGEX.exec(value)){
          error = "Please enter a valid pincode";
        }
        break;
      case 'experience':
        if (value && !NUMBER_REGEX.exec(value)) {
          error = "Please enter experience in years";
        }
       break;
      case 'officialEmail':
        if (value && !EMAIL_REGEX.exec(value)) {
          error = "Please enter valid official email";
        }
        break;
      default:
        break;
    }
    
    setErrors((prev) => ({ ...prev, [name]: error }));
  };