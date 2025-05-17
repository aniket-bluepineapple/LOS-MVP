"use client";

import { ChangeEvent, FocusEvent, FunctionComponent } from "react";
import { ProductFormValues } from "../../types";

const ProductDetails: FunctionComponent<TProductDetailsProps> = ({
  values,
  errors,
  handleChange,
  handleBlur,
  modifyRecord,
}) => {
  return (
    <>
      <ul>
        <li>
          <h2 className="mb-10 text-xl font-bold">
            {modifyRecord ? "Update" : ""} Product Details
          </h2>
        </li>
      </ul>
      {/* Row 1 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="productType" className="block font-medium">
            Product Type*
          </label>
          <input
            type="text"
            id="productType"
            name="productType"
            value={values.productType}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className="w-full rounded border border-[#cadcfc] p-2"
          />
          {errors.productType && (
            <div className="text-red-400">{errors.productType}</div>
          )}
        </div>
        <div>
          <label htmlFor="description" className="block font-medium">
            Description*
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className="w-full rounded border border-[#cadcfc] p-2"
          />
          {errors.description && (
            <div className="text-red-400">{errors.description}</div>
          )}
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="inventoryCount" className="block font-medium">
            Inventory Count*
          </label>
          <input
            type="number"
            id="inventoryCount"
            name="inventoryCount"
            value={values.inventoryCount}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            min={0}
            className="w-full rounded border border-[#cadcfc] p-2"
          />
          {errors.inventoryCount && (
            <div className="text-red-400">{errors.inventoryCount}</div>
          )}
        </div>

        <div>
          <label htmlFor="price" className="block font-medium">
            Price*
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={values.price}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            min={0}
            className="w-full rounded border border-[#cadcfc] p-2"
          />
          {errors.price && <div className="text-red-400">{errors.price}</div>}
        </div>
      </div>
    </>
  );
};

export type TProductDetailsProps = {
  values: ProductFormValues;
  errors: Partial<ProductFormValues>;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (
    e: FocusEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>,
  ) => void;
  modifyRecord: boolean;
};

export default ProductDetails;
