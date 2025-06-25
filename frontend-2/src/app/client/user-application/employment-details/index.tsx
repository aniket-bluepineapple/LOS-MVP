"use client";

import { ChangeEvent, FocusEvent, FunctionComponent } from "react";
import { FormValues } from "../types";
import DocumentPreview from "@/common/document-preview";

const EmploymentDetails: FunctionComponent<EmploymentDetailsProps> = ({
  values,
  errors,
  incomePreview,
  handleChange,
  handleBlur,
  handleFileChange,
}) => {
  return (
    <>
      <ul>
        <li>
          <h2 className="mb-10 mt-12 text-xl font-bold">Employment Details</h2>
        </li>
      </ul>

      {/* Row 7 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="employmentNature" className="mb-4 block font-medium">
            Employment Nature*
          </label>
          <div className="flex justify-start gap-x-20">
            <label htmlFor="employmentNatureSalaried" className="font-medium">
              <input
                type="radio"
                id="employmentNatureSalaried"
                name="employmentNature"
                value="salaried"
                checked={values.employmentNature === "salaried"}
                onChange={(e) => {
                  handleChange(e);
                  handleBlur(e);
                }}
                className="mr-4 cursor-pointer rounded border border-[#cadcfc] p-2 uppercase"
              />
              Salaried
            </label>

            <label
              htmlFor="employmentNatureSelfEmployed"
              className="font-medium"
            >
              {" "}
              <input
                type="radio"
                id="employmentNatureSelfEmployed"
                name="employmentNature"
                value="self-employed"
                checked={values.employmentNature === "self-employed"}
                onChange={(e) => {
                  handleChange(e);
                  handleBlur(e);
                }}
                className="mr-4 cursor-pointer rounded border border-[#cadcfc] p-2 uppercase"
              />
              Self Employed
            </label>
          </div>
          {errors.employmentNature && (
            <div className="text-red-400">{errors.employmentNature}</div>
          )}
        </div>


        <div>
          <label htmlFor="monthlyIncome" className="block font-medium">
            Monthly Income*
          </label>
          <input
            type="number"
            id="monthlyIncome"
            name="monthlyIncome"
            value={values.monthlyIncome}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className="w-full rounded bg-[#fff3] p-2 text-white"
          />
          {errors.monthlyIncome && (
            <div className="text-red-400">{errors.monthlyIncome}</div>
          )}
        </div>
      </div>

      {/* Row 8 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="companyname" className="block font-medium">
            Company Name
          </label>
          <input
            type="text"
            id="companyname"
            name="companyname"
            value={values.companyname}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full rounded bg-[#fff3] p-2 text-white"
          />
          {errors.companyname && (
            <div className="text-red-400">{errors.companyname}</div>
          )}
        </div>
        <div>
          <label htmlFor="experience" className="block font-medium">
            Experience (in years)
          </label>
          <input
            type="number"
            id="experience"
            name="experience"
            value={values.experience}
            onChange={handleChange}
            onBlur={handleBlur}
            min={0}
            className="w-full rounded bg-[#fff3] p-2 text-white"
          />
          {errors.experience && (
            <div className="text-red-400">{errors.experience}</div>
          )}
        </div>
      </div>

      {/* Row 9 */}
      <div className="w-full">
        <div>
          <label htmlFor="companyaddress" className="block font-medium">
            Company Address (with pincode)
          </label>
          <input
            type="text"
            id="companyaddress"
            name="companyaddress"
            value={values.companyaddress}
            onChange={handleChange}
            onBlur={handleBlur}
            className="h-[48px] w-full rounded bg-[#fff3] p-2 text-white"
          />
          {errors.companyaddress && (
            <div className="text-red-400">{errors.companyaddress}</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="officialEmail" className="block font-medium">
            Official Email
          </label>
          <input
            type="text"
            id="officialEmail"
            name="officialEmail"
            value={values.officialEmail}
            onChange={handleChange}
            onBlur={handleBlur}
            className="h-[48px] w-full rounded bg-[#fff3] p-2 text-white"
          />
          {errors.officialEmail && (
            <div className="text-red-400">{errors.officialEmail}</div>
          )}
        </div>

        <div>
          <label htmlFor="incomeProof" className="block font-medium">
            Upload Income Proof*
          </label>
          <input
            type="file"
            id="incomeProof"
            name="incomeProof"
            onChange={handleFileChange}
            required
            className="w-full rounded border border-[#cadcfc] p-2"
          />
          <DocumentPreview
            docPreview={incomePreview}
            previewText={`View Uploaded Income Proof`}
          />
        </div>
      </div>
    </>
  );
};

export type EmploymentDetailsProps = {
  values: FormValues;
  errors: Partial<FormValues>;
  incomePreview: string | null;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (
    e: FocusEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>,
  ) => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default EmploymentDetails;
