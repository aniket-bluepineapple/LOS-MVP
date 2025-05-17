import { Dispatch, SetStateAction } from "react";
import { ProductFormValues } from "../types";
import { ALPA_REGEX, NUMBER_REGEX } from "../../user-application/constants";

export const validateProductForm = (
  name: keyof ProductFormValues,
  inputValue: string,
  setErrors: Dispatch<SetStateAction<Partial<ProductFormValues>>>,
) => {
  let error = "";

  const value = inputValue?.trim();

  switch (name) {
    //Product Details
    case "productType":
      if (!value) {
        error = "Please enter product type";
      } else if (!ALPA_REGEX.exec(value)) {
        error = "Only alphabets are allowed";
      }
      break;

    case "price":
      if (!NUMBER_REGEX.exec(value)) {
        error = "Please enter the price of product";
      }
      break;

    case "inventoryCount":
      if (!NUMBER_REGEX.exec(value)) {
        error = "Please enter the count of product";
      }
      break;

    case "description":
      if (!value) {
        error = "Please enter the product description";
      }
      break;

    default:
      break;
  }

  setErrors((prev) => ({ ...prev, [name]: error }));
};
