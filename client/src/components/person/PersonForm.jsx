import { useState } from 'react'
import { CircleAlert, Plus, RotateCcw, Save, X } from 'lucide-react'
import usePersonStore from '../../stores/personStore'

const emptyPerson = { firstName: '', lastName: '' }
const MAX_LENGTH = 30

const fields = [
  { name: 'firstName', label: 'First name' },
  { name: 'lastName', label: 'Last name' },
]

// Mirrors the backend rules on Person: [Required] and [MaxLength(30)]
function validate(values) {
  const errors = {}
  for (const { name, label } of fields) {
    const value = values[name].trim()
    if (!value) errors[name] = `${label} is required`
    else if (value.length > MAX_LENGTH)
      errors[name] = `${label} must be at most ${MAX_LENGTH} characters`
  }
  return errors
}

// Pass a `key` that changes with `person` so the form resets when switching edits
function PersonForm({ person }) {
  const onSubmit = usePersonStore((state) => state.onSubmit)
  const clearSelectedPerson = usePersonStore((state) => state.clearSelectedPerson)
  const [formValues, setForm] = useState(person ?? emptyPerson)
  const [errors, setErrors] = useState({})
  // Fields the user has left at least once; errors only show for these (or after submit)
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    const next = { ...formValues, [e.target.name]: e.target.value }
    setForm(next)
    setErrors(validate(next))
  }

  function handleBlur(e) {
    setTouched({ ...touched, [e.target.name]: true })
    setErrors(validate(formValues))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validate(formValues)
    setErrors(validationErrors)
    setTouched({ firstName: true, lastName: true })
    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    const ok = await onSubmit({
      ...formValues,
      firstName: formValues.firstName.trim(),
      lastName: formValues.lastName.trim(),
    })
    setSubmitting(false)
    // Keep the input on failure so the user can fix and retry
    if (ok && !person) handleReset()
  }

  // Restores the values the form started with (empty when adding)
  function handleReset() {
    setForm(person ?? emptyPerson)
    setErrors({})
    setTouched({})
  }

  const hasData = fields.some(({ name }) => formValues[name] !== '')

  const fieldClass ='flex flex-1 flex-col gap-1'
  const labelClass = 'text-sm font-medium text-gray-700'
  const inputClass = 'rounded-md border px-3 py-2 focus:outline-none'
  const validInputClass = 'border-gray-300 focus:border-indigo-500'
  const invalidInputClass = 'border-red-500 bg-red-50 focus:border-red-600'

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-4 bg-white p-4 rounded-md shadow-md"
    >
      <div className="flex flex-wrap gap-4">
        {fields.map(({ name, label }) => {
          const error = touched[name] && errors[name]
          return (
            <div key={name} className={fieldClass}>
              <label htmlFor={name} className={labelClass}>
                {label} <span className="text-red-500">*</span>
              </label>
              <input
                id={name}
                name={name}
                value={formValues[name]}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={label}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${name}-error` : undefined}
                className={`${inputClass} ${error ? invalidInputClass : validInputClass}`}
              />
              {error && (
                <p
                  id={`${name}-error`}
                  role="alert"
                  className="flex items-center gap-1 text-sm text-red-600"
                >
                  <CircleAlert className="h-4 w-4 shrink-0" />
                  {error}
                </p>
              )}
            </div>
          )
        })}
      </div>
      <div className="flex flex-wrap justify-start gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60"
        >
          {person ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {person ? 'Update' : 'Add'}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={!hasData}
          className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
        {person && (
          <button
            type="button"
            onClick={clearSelectedPerson}
            className="flex items-center gap-2 rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default PersonForm
