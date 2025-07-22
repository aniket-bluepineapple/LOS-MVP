"use client";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { BACKEND_URL } from "@/constants/layout";
import { useRouter } from "next/navigation";

const schema = [
  z.object({
    firstName: z.string().min(1, "Required"),
    lastName: z.string().min(1, "Required"),
    age: z.number().min(18).max(60),
    pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN"),
    salary: z.number().min(0),
    existingEmis: z.number().min(0),
  }),
  z.object({
    addressType: z.enum(["OWNED", "RENTED"]),
    line1: z.string().min(1, "Required"),
    city: z.string().min(1, "Required"),
    state: z.string().min(1, "Required"),
    pincode: z.string().min(1, "Required"),
    monthlyHomeRent: z.number().optional(),
  }).refine((data) => data.addressType === "RENTED" ? typeof data.monthlyHomeRent === "number" : true, {
    message: "Required",
    path: ["monthlyHomeRent"],
  }),
  z.object({
    dependents: z.number().min(0).max(6),
    confirm: z.boolean().refine((v) => v === true, { message: "Required" }),
  }),
];

const Wizard = () => {
  const [step, setStep] = useState(0);
  const methods = useForm({
    resolver: zodResolver(schema[step]),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      age: undefined,
      pan: "",
      salary: undefined,
      existingEmis: undefined,
      addressType: "OWNED",
      line1: "",
      city: "",
      state: "",
      pincode: "",
      monthlyHomeRent: undefined,
      dependents: 0,
      confirm: false,
    },
  });
  const router = useRouter();

  const next = async () => {
    const valid = await methods.trigger();
    if (!valid) return;
    setStep((s) => Math.min(s + 1, 2));
  };

  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (data: any) => {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      age: data.age,
      pan: data.pan,
      salary: data.salary,
      existingEmis: data.existingEmis,
      addressType: data.addressType,
      line1: data.line1,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      monthlyHomeRent: data.monthlyHomeRent || 0,
      dependents: data.dependents,
      residenceType: data.addressType,
    };
    try {
      const res = await fetch(`${BACKEND_URL}/api/cibil/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (typeof json.score === "number" && !isNaN(json.score)) {
        localStorage.setItem("cibilScore", String(json.score));
      }
      if (typeof json.maxLoanAllowed === "number" && !isNaN(json.maxLoanAllowed)) {
        localStorage.setItem("maxLoanAllowed", String(json.maxLoanAllowed));
      }
      router.push("/sanction-result");
    } catch (e) {
      console.error(e);
    }
  };

  const steps = [<Step1 key={0} />, <Step2 key={1} />, <Step3 key={2} />];

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="mx-auto max-w-xl space-y-6 rounded-3xl bg-white/10 p-6 backdrop-blur">
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div className="h-full bg-blue-500" style={{ width: `${((step + 1) / 3) * 100}%` }} />
        </div>
        <AnimatePresence mode="wait">{steps[step]}</AnimatePresence>
        <div className="flex justify-between">
          {step > 0 && (
            <button type="button" onClick={prev} className="rounded-full bg-gray-200 px-4 py-2">
              Back
            </button>
          )}
          {step < steps.length - 1 && (
            <button type="button" onClick={next} className="ml-auto rounded-full bg-blue-600 px-4 py-2 text-white">
              Next
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default Wizard;
