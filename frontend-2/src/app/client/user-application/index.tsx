'use client'

import { ChangeEvent, FocusEvent, FunctionComponent, useEffect, useState } from "react";
import { FormValues, UserApplicationProps, defaultFormValues } from "./types";
import { validateField } from "./validate-field";
import { validateFile } from "./validate-file";
import { handleSubmit } from "./handle-submit";

const UserApplication: FunctionComponent<UserApplicationProps> = ({data}) => {
  const [values, setValues] = useState<FormValues>(defaultFormValues);
  const [errors, setErrors] = useState<Partial<FormValues>>({});
  const [aadharPreview, setAadharPreview] = useState<string | null>(null);
  const [panPreview, setPanPreview] = useState<string | null>(null);
  const [addressPreview, setAddressPreview] = useState<string | null>(null);
  const [incomePreview, setIncomePreview] = useState<string | null>(null);

  useEffect(()=>{
    if(data){
        setValues((prev)=>({ ...prev, ...data}))
    }
  },[data])

  const today = new Date();
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 60);
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() - 18);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      const error = validateFile(file);
      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }));
        return;
      }
      setValues((prev) => ({ ...prev, [name]: file }));
      setErrors((prev) => ({ ...prev, [name]: "" }));

      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (file.type === "application/pdf") {
          if (name === "aadharFile") {
            setAadharPreview(URL.createObjectURL(file));
          } else if (name === "panFile") {
            setPanPreview(URL.createObjectURL(file));
          }
          else if (name === "addressProof") {
            setAddressPreview(URL.createObjectURL(file));
          }
          else if (name === "incomeProof") {
            setIncomePreview(URL.createObjectURL(file));
          }
        } else {
          if (name === "aadharFile") {
            setAadharPreview(fileReader.result as string);
          } else if (name === "panFile") {
            setPanPreview(fileReader.result as string);
          }
          else if (name === "addressProof") {
            setAddressPreview(fileReader.result as string);
          }
          else if (name === "incomeProof") {
            setIncomePreview(fileReader.result as string);
          }
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name as keyof FormValues, value, values, setErrors);
  };

  return (
    <div className="max-w-screen-md w-full mx-2 md:mx-auto p-6 shadow-lg rounded-2xl border-2 border-[#cadcfc] my-12">
      <ul><li><h2 className="text-xl font-bold mb-8">Personal Details</h2></li></ul>
      
      <form className="space-y-4" onSubmit={(event) => {handleSubmit(event, values , setErrors)}}>
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block font-medium">First Name*</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="w-full p-2 border rounded border-[#00246b]"
            />
            {errors.firstName && <div className="text-red-500">{errors.firstName}</div>}
          </div>
          <div>
            <label htmlFor="lastName" className="block font-medium">Last Name*</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="w-full p-2 border rounded border-[#00246b]"
            />
            {errors.lastName && <div className="text-red-500">{errors.lastName}</div>}
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dob" className="block font-medium">Date of Birth*</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={values.dob}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              max={maxDate.toISOString().split("T")[0]}
              min={minDate.toISOString().split("T")[0]}
              className="w-full p-2 border rounded border-[#00246b]"
            />
            {errors.dob && <div className="text-red-500">{errors.dob}</div>}
          </div>
          <div>
            <label htmlFor="dependents" className="block font-medium">Number of dependents*</label>
            <input
              type="number"
              id="dependents"
              name="dependents"
              value={values.dependents}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              min={0}
              className="w-full p-2 border rounded border-[#00246b]"
            />
            {errors.dependents && <div className="text-red-500">{errors.dependents}</div>}
          </div>
          
        </div>
        
        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
          <label htmlFor="phone" className="block font-medium">Phone Number*</label>
          <input
            type="number"
            id="phone"
            name="phone"
            value={values.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className="w-full p-2 border rounded border-[#00246b]"
          />
          {errors.phone && <div className="text-red-500">{errors.phone}</div>}
        </div>
        <div>
          <label htmlFor="email" className="block font-medium">Email*</label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className="w-full p-2 border rounded border-[#00246b]"
          />
          {errors.email && <div className="text-red-500">{errors.email}</div>}
        </div>
        </div>

        <div className="w-full">
          <div>
            <label htmlFor="address" className="block font-medium">Residential Address (with pincode)*</label>
            <input
              type="text"
              id="address"
              name="address"
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="w-full p-2 h-[48px] border rounded border-[#00246b]"
            />
            {errors.address && <div className="text-red-500">{errors.address}</div>}
          </div>  
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="addressProof" className="block font-medium">Upload Address Proof*</label>
          <input type="file" id="addressProof" name="addressProof" onChange={handleFileChange} required className="w-full p-2  border rounded border-[#00246b]" />
          {addressPreview && (values.addressProof?.type === "application/pdf" ? (
            <a href={addressPreview} target="_blank" rel="noopener noreferrer" className="mt-2 text-blue-500 underline">View Uploaded Address Proof</a>
          ) : (
            <img src={addressPreview} alt="Address Preview" className="mt-2 w-10 h-10 object-cover" />
          ))}
         </div>
          <div>
            <label htmlFor="maritalStatus" className="block font-medium mb-4">Marital Status*</label>
           <div className="flex justify-start gap-x-20" >
            <label htmlFor="maritalStatusSingle" className="font-medium"> 
           <input
            type="radio"
            id="maritalStatusSingle"
            name="maritalStatus"
            value='single'
            checked={values.maritalStatus === "single"}
            onChange={(e) => {
              handleChange(e);
              handleBlur(e);
            }}
            className="p-2 mr-4 border rounded uppercase border-[#00246b] cursor-pointer"
           />
           Single
          </label>
          
          <label htmlFor="maritalStatusMarried" className="font-medium"> <input
            type="radio"
            id="maritalStatusMarried"
            name="maritalStatus"
            value='married'
            checked={values.maritalStatus === "married"}
            onChange={(e) => {
              handleChange(e);
              handleBlur(e);
            }}
            className="p-2 mr-4 border rounded uppercase border-[#00246b] cursor-pointer"
          />
           Married
          </label>
          </div>
           
          {errors.maritalStatus && <div className="text-red-500">{errors.maritalStatus}</div>}</div>
          
        </div>
        
        <ul><li><h2 className="text-xl font-bold mb-10 mt-12">KYC Details</h2></li></ul>

        {/* Row 5 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="aadhar" className="block font-medium">Aadhar Number*</label>
            <input
              type="text"
              id="aadhar"
              name="aadhar"
              value={values.aadhar}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="w-full p-2 border rounded border-[#00246b]"
            />
            {errors.aadhar && <div className="text-red-500">{errors.aadhar}</div>}
          </div>
          <div>

          <label htmlFor="pan" className="block font-medium">PAN Number*</label>
          <input
            type="text"
            id="pan"
            name="pan"
            value={values.pan}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className="w-full p-2 border rounded uppercase border-[#00246b]"
          />
           {errors.pan && <div className="text-red-500">{errors.pan}</div>}
          </div>
        
        </div>

        {/* Row 6 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
          <label htmlFor="aadharFile" className="block font-medium">Upload Aadhar*</label>
          <input type="file" id="aadharFile" name="aadharFile" onChange={handleFileChange} required className="w-full p-2 border rounded border-[#00246b]" />
          {aadharPreview && (values.aadharFile?.type === "application/pdf" ? (
            <a href={aadharPreview} target="_blank" rel="noopener noreferrer" className="mt-2 text-blue-500 underline">View Uploaded Aadhar PDF</a>
          ) : (
            <img src={aadharPreview} alt="Aadhar Preview" className="mt-2 w-10 h-10 object-cover" />
          ))}
        </div>
        <div>
          <label htmlFor="panFile" className="block font-medium">Upload PAN*</label>
          <input type="file" id="panFile" name="panFile" onChange={handleFileChange} required className="w-full p-2  border rounded border-[#00246b]" />
          {panPreview && (values.panFile?.type === "application/pdf" ? (
            <a href={panPreview} target="_blank" rel="noopener noreferrer" className="mt-2 text-blue-500 underline">View Uploaded PAN PDF</a>
          ) : (
            <img src={panPreview} alt="PAN Preview" className="mt-2 w-10 h-10 object-cover" />
          ))}
        </div>

        </div>
        
        <ul><li><h2 className="text-xl font-bold mb-10 mt-12">Employment Details</h2></li></ul>
     
        {/* Row 7 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="employmentNature" className="block font-medium mb-4">Employment Nature*</label>
           <div className="flex justify-start gap-x-20" >
             <label htmlFor="employmentNatureSalaried" className="font-medium"> 
             <input
              type="radio"
              id="employmentNatureSalaried"
              name="employmentNature"
              value='salaried'
              checked={values.employmentNature === "salaried"}
              onChange={(e) => {
                handleChange(e);
                handleBlur(e);
              }}
              className="p-2 mr-4 border rounded uppercase border-[#00246b] cursor-pointer"
           />
           Salaried
          </label>
          
          <label htmlFor="employmentNatureSelfEmployed" className="font-medium"> <input
            type="radio"
            id="employmentNatureSelfEmployed"
            name="employmentNature"
            value='self-employed'
            checked={values.employmentNature === "self-employed"}
            onChange={(e) => {
              handleChange(e);
              handleBlur(e);
            }}
            className="p-2 mr-4 border rounded uppercase border-[#00246b] cursor-pointer"
          />
           Self Employed
          </label>
          </div>
          {errors.employmentNature && <div className="text-red-500">{errors.employmentNature}</div>}</div>

          <div>
            <label htmlFor="monthlyIncome" className="block font-medium">Monthly Income*</label>
            <input
              type="number"
              id="monthlyIncome"
              name="monthlyIncome"
              value={values.monthlyIncome}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="w-full p-2 border rounded border-[#00246b]"
            />
            {errors.monthlyIncome && <div className="text-red-500">{errors.monthlyIncome}</div>}
          </div>
        </div>

        {/* Row 8 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="companyname" className="block font-medium">Company Name</label>
            <input
              type="text"
              id="companyname"
              name="companyname"
              value={values.companyname}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full p-2 border rounded border-[#00246b]"
            />
            {errors.companyname && <div className="text-red-500">{errors.companyname}</div>}
          </div>
          <div>
            <label htmlFor="experience" className="block font-medium">Experience (in years)</label>
            <input
              type="number"
              id="experience"
              name="experience"
              value={values.experience}
              onChange={handleChange}
              onBlur={handleBlur}
              min={0}
              className="w-full p-2 border rounded border-[#00246b]"
            />
            {errors.experience && <div className="text-red-500">{errors.experience}</div>}
          </div>
        </div>

        {/* Row 9 */}
        <div className="w-full">
          <div>
            <label htmlFor="companyaddress" className="block font-medium">Company Address (with pincode)</label>
            <input
              type="text"
              id="companyaddress"
              name="companyaddress"
              value={values.companyaddress}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full p-2 h-[48px] border rounded border-[#00246b]"
            />
            {errors.companyaddress && <div className="text-red-500">{errors.companyaddress}</div>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="officialEmail" className="block font-medium">Official Email</label>
            <input
              type="text"
              id="officialEmail"
              name="officialEmail"
              value={values.officialEmail}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full p-2 h-[48px] border rounded border-[#00246b]"
            />
            {errors.officialEmail && <div className="text-red-500">{errors.officialEmail}</div>}
          </div>
          <div>
          <label htmlFor="incomeProof" className="block font-medium">Upload Income Proof*</label>
          <input type="file" id="incomeProof" name="incomeProof" onChange={handleFileChange} required className="w-full p-2  border rounded border-[#00246b]" />
          {incomePreview && (values.incomeProof?.type === "application/pdf" ? (
            <a href={incomePreview} target="_blank" rel="noopener noreferrer" className="mt-2 text-blue-500 underline">View Uploaded Address Proof</a>
          ) : (
            <img src={incomePreview} alt="Address Preview" className="mt-2 w-10 h-10 object-cover" />
          ))}
         </div>
        </div>
        
        <div className="w-full flex justify-center items-center h-20">
          <button type="submit" className="w-full max-w-[50%] h-10 p-2 hover:bg-[#cadcfc] hover:text-[#00246b] rounded bg-[#00246b] text-[#cadcfc]">
            Submit
          </button>
        </div>
        
      </form>
    </div>
  );
};

export default UserApplication;