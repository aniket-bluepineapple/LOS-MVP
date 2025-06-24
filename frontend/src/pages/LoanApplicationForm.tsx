import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { useState } from 'react'
import WizardCard from '../components/Wizard/WizardCard'
import StepIndicator from '../components/Wizard/StepIndicator'
import TextInput from '../components/fields/TextInput'
import MoneyInput from '../components/fields/MoneyInput'
import SelectInput from '../components/fields/SelectInput'
import { useNavigate } from 'react-router-dom'
import { useCibil } from '../hooks/useCibil'

const schemas = [
  z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    age: z.number().min(18),
    pan: z.string().min(5),
    salary: z.number().min(0),
    existingEmis: z.number().min(0),
  }),
  z.object({
    addressType: z.enum(['Owned', 'Rented']),
    line1: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().min(1),
    monthlyHomeRent: z.number().optional(),
  }),
  z.object({
    dependents: z.number().min(0),
    confirm: z.literal(true),
  }),
]

export type FormData = z.infer<(typeof schemas)[2]> & z.infer<(typeof schemas)[1]> & z.infer<(typeof schemas)[0]>

export default function LoanApplicationForm() {
  const methods = useForm<FormData>({
    resolver: zodResolver(schemas[0].merge(schemas[1]).merge(schemas[2])),
    defaultValues: { age: 18, dependents: 0 },
  })
  const [step, setStep] = useState(0)
  const navigate = useNavigate()
  const cibilMutation = useCibil()

  const next = async () => {
    const valid = await methods.trigger()
    if (!valid) return
    if (step < 2) setStep(step + 1)
    else {
      cibilMutation.mutate(methods.getValues(), {
        onSuccess: (data) => navigate('/offer', { state: data }),
      })
    }
  }

  const prev = () => setStep((s) => Math.max(0, s - 1))

  return (
    <FormProvider {...methods}>
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-4">
        <StepIndicator current={step} total={3} />
        <AnimatePresence mode="wait">
          {step === 0 && (
            <WizardCard key="step1">
              <TextInput label="First Name" register={methods.register('firstName')} />
              <TextInput label="Last Name" register={methods.register('lastName')} />
              <TextInput label="Age" type="number" register={methods.register('age', { valueAsNumber: true })} />
              <TextInput label="PAN" register={methods.register('pan')} />
              <MoneyInput label="Salary" register={methods.register('salary', { valueAsNumber: true })} />
              <MoneyInput label="Existing EMIs" register={methods.register('existingEmis', { valueAsNumber: true })} />
            </WizardCard>
          )}
          {step === 1 && (
            <WizardCard key="step2">
              <SelectInput
                label="Address Type"
                options={[{ value: 'Owned', label: 'Owned' }, { value: 'Rented', label: 'Rented' }]}
                register={methods.register('addressType')}
              />
              <TextInput label="Line 1" register={methods.register('line1')} />
              <TextInput label="City" register={methods.register('city')} />
              <TextInput label="State" register={methods.register('state')} />
              <TextInput label="Pincode" register={methods.register('pincode')} />
              {methods.watch('addressType') === 'Rented' && (
                <MoneyInput label="Monthly Home Rent" register={methods.register('monthlyHomeRent', { valueAsNumber: true })} />
              )}
            </WizardCard>
          )}
          {step === 2 && (
            <WizardCard key="step3">
              <SelectInput
                label="Dependents"
                options={Array.from({ length: 7 }, (_, i) => ({ value: i, label: `${i}` }))}
                register={methods.register('dependents', { valueAsNumber: true })}
              />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...methods.register('confirm')} /> I confirm my application
              </label>
            </WizardCard>
          )}
        </AnimatePresence>
        <div className="mt-4 flex justify-between">
          {step > 0 && (
            <button onClick={prev} className="rounded-xl bg-gray-600 px-4 py-2">
              Back
            </button>
          )}
          <button onClick={next} className="ml-auto rounded-xl bg-blue-600 px-4 py-2">
            {step === 2 ? 'Get My Offer →' : 'Next'}
          </button>
        </div>
      </div>
    </FormProvider>
  )
}
