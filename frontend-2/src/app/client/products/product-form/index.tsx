"use client";

import {
  ChangeEvent,
  FocusEvent,
  FunctionComponent,
  useEffect,
  useState,
} from "react";
import ProductDetails from "./product-details";
import {
  ProductFormValues,
  ProductProps,
  defaultProductFormValues,
} from "../types";
import { validateProductForm } from "../helpers/validate-product-form";
import { handleProductSubmit } from "../helpers/handle-product-submit";

const ProductsForm: FunctionComponent<ProductProps> = ({
  data,
  modifyRecord = false,
  productId,
}) => {
  const [values, setValues] = useState<ProductFormValues>(
    defaultProductFormValues,
  );
  const [errors, setErrors] = useState<Partial<ProductFormValues>>({});

  useEffect(() => {
    if (data) {
      const orignalValues: ProductFormValues = {
        productType: data.ProductType ?? "",
        description: data.Description ?? "",
        inventoryCount: String(data.InventoryCount ?? ""),
        price: String(data.Price ?? ""),
      };

      setValues((prev) => ({ ...prev, ...orignalValues }));
    }
  }, [data]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (
    e: FocusEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    validateProductForm(name as keyof ProductFormValues, value, setErrors);
  };

  return (
    <div className="mx-2 my-12 w-full max-w-screen-md rounded-2xl border-2 border-[#cadcfc] p-6 shadow-lg md:mx-auto">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          handleProductSubmit(
            event,
            values,
            setErrors,
            modifyRecord,
            productId,
          );
        }}
      >
        <ProductDetails
          values={values}
          errors={errors}
          handleBlur={handleBlur}
          handleChange={handleChange}
          modifyRecord={modifyRecord}
        />

        <div className="flex h-20 w-full items-center justify-center">
          <button
            type="submit"
            className="h-10 w-full max-w-[50%] rounded-xl bg-[#00246b] p-2 text-[#cadcfc] hover:bg-[#cadcfc] hover:text-[#00246b]"
          >
            {modifyRecord ? "Update Product" : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductsForm;
