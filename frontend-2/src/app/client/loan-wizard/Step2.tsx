"use client";
import { useFormContext, Controller } from "react-hook-form";
import { motion } from "framer-motion";

const Step2 = () => {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const type = watch("addressType");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold">Residential Address</h2>
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="OWNED"
            {...register("addressType")}
            className="rounded"
          />
          Owned
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="RENTED"
            {...register("addressType")}
            className="rounded"
          />
          Rented
        </label>
      </div>
      {errors.addressType && (
        <p className="text-sm text-red-500">{String(errors.addressType.message)}</p>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="line1" className="block font-medium">
            Address Line
          </label>
          <input
            id="line1"
            {...register("line1")}
            className="w-full rounded-3xl border border-gray-300 p-2"
            type="text"
          />
          {errors.line1 && (
            <p className="text-sm text-red-500">{String(errors.line1.message)}</p>
          )}
        </div>
        <div>
          <label htmlFor="city" className="block font-medium">
            City
          </label>
          <input
            id="city"
            {...register("city")}
            className="w-full rounded-3xl border border-gray-300 p-2"
            type="text"
          />
          {errors.city && (
            <p className="text-sm text-red-500">{String(errors.city.message)}</p>
          )}
        </div>
        <div>
          <label htmlFor="state" className="block font-medium">
            State
          </label>
          <input
            id="state"
            {...register("state")}
            className="w-full rounded-3xl border border-gray-300 p-2"
            type="text"
          />
          {errors.state && (
            <p className="text-sm text-red-500">{String(errors.state.message)}</p>
          )}
        </div>
        <div>
          <label htmlFor="pincode" className="block font-medium">
            Pincode
          </label>
          <input
            id="pincode"
            {...register("pincode")}
            className="w-full rounded-3xl border border-gray-300 p-2"
            type="text"
          />
          {errors.pincode && (
            <p className="text-sm text-red-500">{String(errors.pincode.message)}</p>
          )}
        </div>
        {type === "RENTED" && (
          <div>
            <label htmlFor="monthlyHomeRent" className="block font-medium">
              Monthly Home Rent
            </label>
            <input
              id="monthlyHomeRent"
              type="number"
              {...register("monthlyHomeRent", { valueAsNumber: true })}
              className="w-full rounded-3xl border border-gray-300 p-2"
            />
            {errors.monthlyHomeRent && (
              <p className="text-sm text-red-500">{String(errors.monthlyHomeRent.message)}</p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Step2;
