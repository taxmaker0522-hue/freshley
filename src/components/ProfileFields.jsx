import { digits, inputClass } from '../utils/profile'

export function Field({ id, label, hint, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-soil">
        {label}
        {hint && <span className="font-normal text-muted"> · {hint}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm text-error">
          {error}
        </p>
      )}
    </div>
  )
}

export function MobileInput({ id, value, onChange, error, ...props }) {
  return (
    <div className="flex">
      <span className="flex min-h-12 items-center rounded-l-2xl border border-r-0 border-leaf/25 bg-lime/10 px-3 text-base text-secondary">
        +91
      </span>
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        maxLength={10}
        value={value}
        onChange={(event) => onChange(digits(event.target.value, 10))}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputClass} rounded-l-none ${error ? 'border-error' : 'border-leaf/25'}`}
        {...props}
      />
    </div>
  )
}

function ProfileFields({ idPrefix, profile, onChange, errors, showMobile = true }) {
  const set = (key, value) => onChange({ ...profile, [key]: value })
  const setAddress = (key, value) => onChange({ ...profile, address: { ...profile.address, [key]: value } })

  const text = (key, value, onValue, props = {}) => ({
    id: `${idPrefix}-${key}`,
    value,
    onChange: (event) => onValue(event.target.value),
    'aria-invalid': Boolean(errors[key]),
    'aria-describedby': errors[key] ? `${idPrefix}-${key}-error` : undefined,
    className: `${inputClass} ${errors[key] ? 'border-error' : 'border-leaf/25'}`,
    ...props,
  })

  return (
    <div className="flex flex-col gap-4">
      <Field id={`${idPrefix}-name`} label="Full name" error={errors.name}>
        <input {...text('name', profile.name, (v) => set('name', v), { autoComplete: 'name' })} />
      </Field>

      {showMobile && (
        <Field id={`${idPrefix}-mobile`} label="Mobile number" error={errors.mobile}>
          <MobileInput
            id={`${idPrefix}-mobile`}
            value={profile.mobile}
            onChange={(v) => set('mobile', v)}
            error={errors.mobile}
          />
        </Field>
      )}

      <Field
        id={`${idPrefix}-altMobile`}
        label="Alternate number"
        hint="optional, for delivery"
        error={errors.altMobile}
      >
        <MobileInput
          id={`${idPrefix}-altMobile`}
          value={profile.altMobile}
          onChange={(v) => set('altMobile', v)}
          error={errors.altMobile}
          autoComplete="off"
        />
      </Field>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-3 text-sm font-semibold uppercase tracking-wide text-secondary">
          Delivery address
        </legend>
        <Field id={`${idPrefix}-line1`} label="House / flat no. and street" error={errors.line1}>
          <input
            {...text('line1', profile.address.line1, (v) => setAddress('line1', v), {
              autoComplete: 'address-line1',
            })}
          />
        </Field>
        <Field id={`${idPrefix}-line2`} label="Area / locality and landmark" error={errors.line2}>
          <input
            {...text('line2', profile.address.line2, (v) => setAddress('line2', v), {
              autoComplete: 'address-line2',
            })}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field id={`${idPrefix}-city`} label="City" error={errors.city}>
            <input
              {...text('city', profile.address.city, (v) => setAddress('city', v), {
                autoComplete: 'address-level2',
              })}
            />
          </Field>
          <Field id={`${idPrefix}-pincode`} label="Pincode" error={errors.pincode}>
            <input
              {...text('pincode', profile.address.pincode, (v) => setAddress('pincode', digits(v, 6)), {
                inputMode: 'numeric',
                maxLength: 6,
                autoComplete: 'postal-code',
              })}
            />
          </Field>
        </div>
      </fieldset>
    </div>
  )
}

export default ProfileFields
