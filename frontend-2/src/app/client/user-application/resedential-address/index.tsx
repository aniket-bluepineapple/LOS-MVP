"use client";

import { ChangeEvent, FocusEvent, FunctionComponent } from "react";
import { FormValues } from "../types";
import DocumentPreview from "@/common/document-preview";

const ResedentialAddress: FunctionComponent<TResedentialAddressProps> = ({
  values,
  errors,
  addressPreview,
  handleChange,
  handleBlur,
  handleFileChange,
}) => {
  return (
    <>
      <ul>
        <li>
          <h2 className="mb-10 mt-12 text-xl font-bold">Resedential Address</h2>
        </li>
      </ul>
      {/* Row 1 */}
      <div className="w-full">
        <div>
          <label htmlFor="street" className="block font-medium">
            Street*
          </label>
          <input
            type="text"
            id="street"
            name="street"
            value={values.street}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className="h-[48px] w-full rounded border border-[#cadcfc] p-2"
          />
          {errors.street && <div className="text-red-400">{errors.street}</div>}
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="city" className="block font-medium">
            City*
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={values.city}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className="w-full rounded border border-[#cadcfc] p-2"
          />
          {errors.city && <div className="text-red-400">{errors.city}</div>}
        </div>
        <div>
          <label htmlFor="district" className="block font-medium">
            District*
          </label>
          <input
            type="text"
            id="district"
            name="district"
            value={values.district}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className="w-full rounded border border-[#cadcfc] p-2"
          />
          {errors.district && (
            <div className="text-red-400">{errors.district}</div>
          )}
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="state" className="block font-medium">
            State*
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={values.state}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className="w-full rounded border border-[#cadcfc] p-2"
          />
          {errors.state && <div className="text-red-400">{errors.state}</div>}
        </div>
        <div>
          <label htmlFor="pincode" className="block font-medium">
            Pincode*
          </label>
          <input
            type="number"
            id="pincode"
            name="pincode"
            value={values.pincode}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className="w-full rounded border border-[#cadcfc] p-2"
          />
          {errors.pincode && (
            <div className="text-red-400">{errors.pincode}</div>
          )}
        </div>
      </div>

      {/* Row 5 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="addressType" className="mb-4 block font-medium">
            Address Type*
          </label>
          <div className="flex justify-start gap-x-20">
            <label htmlFor="addressTypeOwned" className="font-medium">
              <input
                type="radio"
                id="addressTypeOwned"
                name="addressType"
                value="owned"
                checked={values.addressType === "owned"}
                onChange={(e) => {
                  handleChange(e);
                  handleBlur(e);
                }}
                className="mr-4 cursor-pointer rounded border border-[#cadcfc] p-2 uppercase"
              />
              Owned
            </label>

            <label htmlFor="addressTypeRented" className="font-medium">
              {" "}
              <input
                type="radio"
                id="addressTypeRented"
                name="addressType"
                value="rented"
                checked={values.addressType === "rented"}
                onChange={(e) => {
                  handleChange(e);
                  handleBlur(e);
                }}
                className="mr-4 cursor-pointer rounded border border-[#cadcfc] p-2 uppercase"
              />
              Rented
            </label>
          </div>
          {errors.addressType && (
            <div className="text-red-400">{errors.addressType}</div>
          )}
        </div>
        {values.addressType === "rented" && (
          <div>
            <label htmlFor="monthlyRent" className="block font-medium">
              Monthly Rent
            </label>
            <input
              type="number"
              id="monthlyRent"
              name="monthlyRent"
              value={values.monthlyRent}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="w-full rounded border border-[#cadcfc] p-2"
            />
            {errors.monthlyRent && (
              <div className="text-red-400">{errors.monthlyRent}</div>
            )}
          </div>
        )}
      </div>

      {/* Row 6 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="addressProof" className="block font-medium">
            Upload Address Proof*
          </label>
          <input
            type="file"
            id="addressProof"
            name="addressProof"
            onChange={handleFileChange}
            required
            className="w-full cursor-pointer rounded border border-[#cadcfc] p-2"
          />
          <DocumentPreview
            docPreview={addressPreview}
            previewText={`View Uploaded Address Proof`}
          />
        </div>
      </div>
    </>
  );
};

export type TResedentialAddressProps = {
  values: FormValues;
  errors: Partial<FormValues>;
  addressPreview: string | null;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (
    e: FocusEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>,
  ) => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default ResedentialAddress;
