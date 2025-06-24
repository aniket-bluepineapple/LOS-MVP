"use client";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";

const Step1 = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold">Personal Details</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block font-medium">
            First Name
          </label>
          <input
            id="firstName"
            {...register("firstName")}
            className="w-full rounded-3xl border border-gray-300 p-2"
            type="text"
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{String(errors.firstName.message)}</p>
          )}
        </div>
        <div>
          <label htmlFor="lastName" className="block font-medium">
            Last Name
          </label>
          <input
            id="lastName"
            {...register("lastName")}
            className="w-full rounded-3xl border border-gray-300 p-2"
            type="text"
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">{String(errors.lastName.message)}</p>
          )}
        </div>
        <div>
          <label htmlFor="age" className="block font-medium">
            Age
          </label>
          <input
            id="age"
            type="number"
            {...register("age", { valueAsNumber: true })}
            className="w-full rounded-3xl border border-gray-300 p-2"
          />
          {errors.age && (
            <p className="text-sm text-red-500">{String(errors.age.message)}</p>
          )}
        </div>
        <div>
          <label htmlFor="pan" className="block font-medium">
            PAN
          </label>
          <input
            id="pan"
            {...register("pan")}
            className="w-full rounded-3xl border border-gray-300 p-2 uppercase"
            type="text"
          />
          {errors.pan && (
            <p className="text-sm text-red-500">{String(errors.pan.message)}</p>
          )}
        </div>
        <div>
          <label htmlFor="salary" className="block font-medium">
            Monthly Salary
          </label>
          <input
            id="salary"
            type="number"
            {...register("salary", { valueAsNumber: true })}
            className="w-full rounded-3xl border border-gray-300 p-2"
          />
          {errors.salary && (
            <p className="text-sm text-red-500">{String(errors.salary.message)}</p>
          )}
        </div>
        <div>
          <label htmlFor="existingEmis" className="block font-medium">
            Existing EMIs
          </label>
          <input
            id="existingEmis"
            type="number"
            {...register("existingEmis", { valueAsNumber: true })}
            className="w-full rounded-3xl border border-gray-300 p-2"
          />
          {errors.existingEmis && (
            <p className="text-sm text-red-500">{String(errors.existingEmis.message)}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Step1;
