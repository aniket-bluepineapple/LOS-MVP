"use client";

import { ChangeEvent, FocusEvent, FunctionComponent, useState } from "react";
import { FormValues } from "../types";
import { MAX_DATE, MIN_DATE } from "../constants";
import {
  sendPhoneOTP,
  verifyPhoneOTP,
  sendEmailOTP,
  verifyEmailOTP,
} from "@/auth/otp-auth";

const PersonalDetails: FunctionComponent<PersonalDetailsProps> = ({
  values,
  errors,
  handleChange,
  handleBlur,
}) => {
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneStatus, setPhoneStatus] = useState("");
  const [phoneVerifyStatus, setPhoneVerifyStatus] = useState("");

  const [emailOtp, setEmailOtp] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [emailVerifyStatus, setEmailVerifyStatus] = useState("");

  const handleSendPhoneOTP = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!values.phone.trim()) {
      setPhoneStatus("Please enter a valid phone number.");
      return;
    }
    const response = await sendPhoneOTP(`+91${values.phone.trim()}`);
    setPhoneStatus(response);
  };

  const handleVerifyPhoneOTP = async () => {
    const response = await verifyPhoneOTP(phoneOtp);
    setPhoneVerifyStatus(response);
    handleChange({
      target: {
        name: "isPhoneVerified",
        value: response === "Phone Verified!",
      },
    } as unknown as ChangeEvent<HTMLInputElement>);
  };

  // Send Email Verification
  const handleSendEmailOTP = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!values.email.trim()) {
      setEmailStatus("Please enter a valid email address.");
      return;
    }
    const response = await sendEmailOTP(values.email.trim());
    setEmailStatus(response);
  };

  const handleVerifyEmailOTP = async () => {
    const response = await verifyEmailOTP(values.email.trim(), emailOtp);
    setEmailVerifyStatus(response);
    handleChange({
      target: {
        name: "isEmailVerified",
        value: response === "Email Verified!",
      },
    } as unknown as ChangeEvent<HTMLInputElement>);
  };

  return (
    <>
      <ul>
        <li>
          <h2 className="mb-10 text-xl font-bold">Personal Details</h2>
        </li>
      </ul>
      {/* Row 1 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block font-medium">
            First Name*
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={values.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className="w-full rounded border border-[#cadcfc] p-2"
          />
          {errors.firstName && (
            <div className="text-red-400">{errors.firstName}</div>
          )}
        </div>
        <div>
          <label htmlFor="lastName" className="block font-medium">
            Last Name*
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={values.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className="w-full rounded border border-[#cadcfc] p-2"
          />
          {errors.lastName && (
            <div className="text-red-400">{errors.lastName}</div>
          )}
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="dob" className="block font-medium">
            Date of Birth*
          </label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={values.dob}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            max={MAX_DATE.toISOString().split("T")[0]}
            min={MIN_DATE.toISOString().split("T")[0]}
            className="w-full rounded border border-[#cadcfc] p-2"
          />
          {errors.dob && <div className="text-red-400">{errors.dob}</div>}
        </div>
        <div>
          <label htmlFor="dependents" className="block font-medium">
            Number of dependents*
          </label>
          <input
            type="number"
            id="dependents"
            name="dependents"
            value={values.dependents}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            min={0}
            className="w-full rounded border border-[#cadcfc] p-2"
          />
          {errors.dependents && (
            <div className="text-red-400">{errors.dependents}</div>
          )}
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="phone" className="block font-medium">
            Phone Number*
          </label>
          <input
            type="number"
            id="phone"
            name="phone"
            value={values.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className="w-full rounded border border-[#cadcfc] p-2"
          />
          {errors.phone && <div className="text-red-400">{errors.phone}</div>}
          {values.phone ? (
            <>
              {!values.isPhoneVerified ? (
                <button
                  type="button" // This prevents it from triggering full form validation
                  onClick={handleSendPhoneOTP}
                  className="mt-2 rounded bg-blue-500 p-2 text-white"
                >
                  Send OTP
                </button>
              ) : null}

              <label htmlFor="phoneOTP" className="mt-2 block font-medium">
                Phone OTP*
              </label>
              <input
                type="text"
                id="phoneOTP"
                name="phoneOTP"
                placeholder="Enter Phone OTP"
                value={phoneOtp}
                onChange={(e) => {
                  setPhoneOtp(e.target.value);
                  handleChange(e);
                }}
                onBlur={handleBlur}
                disabled={values?.isPhoneVerified}
                className="mt-2 w-full rounded border border-[#cadcfc] p-2"
              />
              {!values.isPhoneVerified && errors.isPhoneVerified ? (
                <div className="mt-2 text-red-400">
                  {errors.isPhoneVerified}
                </div>
              ) : null}
              {!values.isPhoneVerified ? (
                <button
                  onClick={handleVerifyPhoneOTP}
                  className="mt-2 rounded bg-green-500 p-2 text-white"
                >
                  Verify OTP
                </button>
              ) : null}
              {values.isPhoneVerified ? (
                <div className="mt-2 text-blue-500">Phone number verified!</div>
              ) : !phoneVerifyStatus ? (
                <div className="mt-2 text-blue-500">{phoneStatus}</div>
              ) : (
                <div className="mt-2 text-red-400">{phoneVerifyStatus}</div>
              )}
            </>
          ) : null}
        </div>
        <div>
          <label htmlFor="email" className="block font-medium">
            Email*
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className="w-full rounded border border-[#cadcfc] p-2"
          />
          {errors.email && <div className="text-red-400">{errors.email}</div>}
          {values.email ? (
            <>
              {!values.isEmailVerified ? (
                <button
                  onClick={handleSendEmailOTP}
                  disabled={!values.email}
                  className="mt-2 cursor-pointer rounded bg-blue-500 p-2 text-white"
                >
                  Send OTP
                </button>
              ) : null}
              <label htmlFor="emailOtp" className="mt-2 block font-medium">
                Email OTP*
              </label>
              <input
                type="text"
                id="emailOtp"
                name="emailOtp"
                placeholder="Enter OTP"
                value={emailOtp}
                onChange={(e) => {
                  setEmailOtp(e.target.value);
                  handleChange(e);
                }}
                onBlur={handleBlur}
                disabled={values?.isEmailVerified}
                className="mt-2 w-full rounded border border-[#cadcfc] p-2"
              />
              {!values.isEmailVerified && errors.isEmailVerified ? (
                <div className="mt-2 text-red-400">
                  {errors.isEmailVerified}
                </div>
              ) : null}
              {!values.isEmailVerified ? (
                <button
                  onClick={handleVerifyEmailOTP}
                  className="mt-2 rounded bg-green-500 p-2 text-white"
                >
                  Verify OTP
                </button>
              ) : null}
              {values.isEmailVerified ? (
                <div className="mt-2 text-blue-500">Email verified!</div>
              ) : !emailVerifyStatus ? (
                <div className="mt-2 text-blue-500">{emailStatus}</div>
              ) : (
                <div className="mt-2 text-red-400">{emailVerifyStatus}</div>
              )}
            </>
          ) : null}
        </div>
      </div>

      {/* Row 5 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="maritalStatus" className="mb-4 block font-medium">
            Marital Status*
          </label>
          <div className="flex justify-start gap-x-20">
            <label htmlFor="maritalStatusSingle" className="font-medium">
              <input
                type="radio"
                id="maritalStatusSingle"
                name="maritalStatus"
                value="single"
                checked={values.maritalStatus === "single"}
                onChange={(e) => {
                  handleChange(e);
                  handleBlur(e);
                }}
                className="mr-4 cursor-pointer rounded border border-[#cadcfc] p-2 uppercase"
              />
              Single
            </label>

            <label htmlFor="maritalStatusMarried" className="font-medium">
              {" "}
              <input
                type="radio"
                id="maritalStatusMarried"
                name="maritalStatus"
                value="married"
                checked={values.maritalStatus === "married"}
                onChange={(e) => {
                  handleChange(e);
                  handleBlur(e);
                }}
                className="mr-4 cursor-pointer rounded border border-[#cadcfc] p-2 uppercase"
              />
              Married
            </label>
          </div>
          {errors.maritalStatus && (
            <div className="text-red-400">{errors.maritalStatus}</div>
          )}
        </div>
      </div>
    </>
  );
};

export type PersonalDetailsProps = {
  values: FormValues;
  errors: Partial<FormValues>;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (
    e: FocusEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>,
  ) => void;
};

export default PersonalDetails;
