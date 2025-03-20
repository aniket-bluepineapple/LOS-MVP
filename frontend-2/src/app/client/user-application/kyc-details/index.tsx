"use client";

import { ChangeEvent, FocusEvent, FunctionComponent } from "react";
import { FormValues } from "../types";

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
            className="w-full rounded border border-[#cadcfc] p-2"
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
            className="w-full rounded border border-[#cadcfc] p-2 uppercase"
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
          {aadharPreview &&
            (values.aadharFile?.type === "application/pdf" ? (
              <a
                href={aadharPreview}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-blue-500 underline"
              >
                View Uploaded Aadhar PDF
              </a>
            ) : (
              <img
                src={aadharPreview}
                alt="Aadhar Preview"
                className="mt-2 h-10 w-10 object-cover"
              />
            ))}
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
          {panPreview &&
            (values.panFile?.type === "application/pdf" ? (
              <a
                href={panPreview}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-blue-500 underline"
              >
                View Uploaded PAN PDF
              </a>
            ) : (
              <img
                src={panPreview}
                alt="PAN Preview"
                className="mt-2 h-10 w-10 object-cover"
              />
            ))}
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
