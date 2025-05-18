import { Dispatch, FormEvent, SetStateAction } from "react";

import { ProductFormValues } from "../types";
import { validateProductForm } from "./validate-product-form";
import { BACKEND_URL } from "@/constants/layout";

export const handleProductSubmit = async (
  e: FormEvent,
  values: ProductFormValues,
  setErrors: Dispatch<SetStateAction<Partial<ProductFormValues>>>,
  modifyRecord: boolean,
  productId?: number,
) => {
  e.preventDefault();
  let isValid = true;

  Object.keys(values).forEach((key) => {
    if (!values[key as keyof ProductFormValues]) {
      validateProductForm(key as keyof ProductFormValues, "", setErrors);
      isValid = false;
    }
  });

  if (!isValid) return;

  const productPayload = {
    ProductType: values.productType,
    Description: values.description,
    InventoryCount: values.inventoryCount,
    Price: values.price,
  };

  try {
    if (modifyRecord && productId) {
      const productResponse = await fetch(
        `${BACKEND_URL}/api/products/${productId}`,
        {
          method: "PUT",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productPayload),
        },
      );

      const productData = await productResponse.json();
      if (!productResponse.ok)
        throw new Error(productData.message ?? "Product updation failed");

      alert("Product deatils updated successfully!");
    } else {
      const productResponse = await fetch(`${BACKEND_URL}/api/products/`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productPayload),
      });

      const productData = await productResponse.json();
      if (!productResponse.ok)
        throw new Error(productData.message ?? "Product creation failed");

      alert("Product deatils added successfully!");
    }
  } catch (error) {
    console.error("API Request Error:", error);
  }
};
