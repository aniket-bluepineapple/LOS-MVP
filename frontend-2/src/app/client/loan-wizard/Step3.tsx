"use client";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";

const Step3 = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const addressType = watch("addressType");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold">Extras</h2>
      <div>
        <label htmlFor="dependents" className="block font-medium">
          Dependents
        </label>
        <select
          id="dependents"
          {...register("dependents", { valueAsNumber: true })}
          className="w-full rounded-3xl border border-gray-300 p-2"
        >
          {[0, 1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        {errors.dependents && (
          <p className="text-sm text-red-500">{String(errors.dependents.message)}</p>
        )}
      </div>
      <p className="font-medium">
        Residence Type: <span className="font-semibold">{addressType}</span>
      </p>
      <label className="flex items-center gap-2">
        <input type="checkbox" {...register("confirm", { required: true })} />
        I confirm that the above details are correct
      </label>
      {errors.confirm && (
        <p className="text-sm text-red-500">Please confirm before submitting.</p>
      )}
      <button
        type="submit"
        className="mx-auto block rounded-full bg-blue-600 px-6 py-2 text-white hover:bg-blue-500"
      >
        Get My Offer →
      </button>
    </motion.div>
  );
};

export default Step3;
