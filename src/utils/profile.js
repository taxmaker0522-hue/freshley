import { servicePincodes } from '../data/pincodes'
import { MOBILE_REGEX } from '../hooks/useAuth'

export const EMPTY_PROFILE = {
  name: '',
  mobile: '',
  altMobile: '',
  address: { line1: '', line2: '', city: '', pincode: '' },
}

export const inputClass =
  'min-h-12 w-full rounded-2xl border bg-surface px-4 py-3 text-base text-soil placeholder:text-muted focus:border-leaf focus:outline-none focus:ring-2 focus:ring-leaf/30'

export const digits = (value, max) => value.replace(/\D/g, '').slice(0, max)

// Returns { field: message } — empty object when the profile is valid.
export function validateProfile(profile, { withMobile = true } = {}) {
  const errors = {}
  const { address } = profile
  if (profile.name.trim().length < 2) errors.name = 'Enter your full name.'
  if (withMobile && !MOBILE_REGEX.test(profile.mobile)) errors.mobile = 'Enter a 10-digit mobile number.'
  if (profile.altMobile) {
    if (!MOBILE_REGEX.test(profile.altMobile)) errors.altMobile = 'Enter a 10-digit number, or leave it empty.'
    else if (profile.altMobile === profile.mobile) errors.altMobile = 'Use a different number from your main one.'
  }
  if (address.line1.trim().length < 3) errors.line1 = 'Enter your house or flat number and street.'
  if (address.line2.trim().length < 2) errors.line2 = 'Enter your area or locality.'
  if (address.city.trim().length < 2) errors.city = 'Enter your city.'
  if (!/^[1-9][0-9]{5}$/.test(address.pincode)) errors.pincode = 'Enter a 6-digit pincode.'
  else if (!servicePincodes.includes(address.pincode))
    errors.pincode = `We don’t deliver to ${address.pincode} yet. Check “Delivery areas” to get notified.`
  return errors
}

export function cleanProfile(profile) {
  const { address } = profile
  return {
    name: profile.name.trim(),
    mobile: profile.mobile,
    altMobile: profile.altMobile,
    address: {
      line1: address.line1.trim(),
      line2: address.line2.trim(),
      city: address.city.trim(),
      pincode: address.pincode,
    },
  }
}
