import { Dispatch, FormEvent, SetStateAction } from "react";
import { validateField } from "./validate-field";
import { FormValues } from "../types";

export const handleSubmit = (e: FormEvent, values:FormValues, setErrors:Dispatch<SetStateAction<Partial<FormValues>>>) => {
    e.preventDefault();
    let isValid = true;
    Object.keys(values).forEach((key) => {
      if (!values[key as keyof FormValues]) {
        validateField(key as keyof FormValues, "", values, setErrors);
        isValid = false;
      }
    });
    if (isValid) {
      alert("Form submitted successfully!");
    }
};