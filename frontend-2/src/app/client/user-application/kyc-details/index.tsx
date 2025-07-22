"use client";

import { ChangeEvent, FocusEvent, FunctionComponent } from "react";
import { FormValues } from "../types";
import DocumentPreview from "@/common/document-preview";

const KYCDetails: FunctionComponent<KYCDetailsProps> = ({
  values,
  errors,
  panPreview,
  aadharPreview,
  handleChange,
  handleBlur,
  handleFileChange,
}) => {
  return (
    <>
      <ul>
        <li>
          <h2 className="mb-10 mt-12 text-xl font-bold">KYC Details</h2>
        </li>
      </ul>

      {/* Row 5 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="aadhar" className="block font-medium">
            Aadhar Number*
          </label>
          <input
            type="text"
            id="aadhar"
            name="aadhar"
            value={values.aadhar}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className="w-full rounded bg-[#fff3] p-2 text-white"
          />
          {errors.aadhar && <div className="text-red-400">{errors.aadhar}</div>}
        </div>
        <div>
          <label htmlFor="pan" className="block font-medium">
            PAN Number*
          </label>
          <input
            type="text"
            id="pan"
            name="pan"
            value={values.pan}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className="w-full rounded bg-[#fff3] p-2 text-white uppercase"
          />
          {errors.pan && <div className="text-red-400">{errors.pan}</div>}
        </div>
      </div>

      {/* Row 6 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="aadharFile" className="block font-medium">
            Upload Aadhar*
          </label>
          <input
            type="file"
            id="aadharFile"
            name="aadharFile"
            onChange={handleFileChange}
            required
            className="w-full rounded border border-[#cadcfc] p-2"
          />
          <DocumentPreview
            docPreview={aadharPreview}
            previewText={`View Uploaded Aadhar PDF`}
          />
        </div>
        <div>
          <label htmlFor="panFile" className="block font-medium">
            Upload PAN*
          </label>
          <input
            type="file"
            id="panFile"
            name="panFile"
            onChange={handleFileChange}
            required
            className="w-full rounded border border-[#cadcfc] p-2"
          />
          <DocumentPreview
            docPreview={panPreview}
            previewText={`View Uploaded PAN PDF`}
          />
        </div>
      </div>
    </>
  );
};

export type KYCDetailsProps = {
  values: FormValues;
  errors: Partial<FormValues>;
  aadharPreview: string | null;
  panPreview: string | null;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (
    e: FocusEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>,
  ) => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default KYCDetails;
