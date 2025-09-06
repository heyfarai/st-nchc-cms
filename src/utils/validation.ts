/**
 * Common validation utilities for Payload collections
 */

/**
 * Validates a URL format (must start with http:// or https://)
 */
export const validateUrl = (val: string | null | undefined): true | string => {
  if (val && !val.match(/^https?:\/\/.+/)) {
    return 'Please enter a valid URL starting with http:// or https://'
  }
  return true
}

/**
 * Validates a 24-hour time format (HH:MM)
 */
export const validateTime = (val: string | null | undefined): true | string => {
  if (val && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val)) {
    return 'Please use 24-hour format (HH:MM)'
  }
  return true
}

/**
 * Validates a US ZIP code format (5 digits or 5 digits + dash + 4 digits)
 */
export const validateZipCode = (val: string | null | undefined): true | string => {
  if (val && !/^\d{5}(-\d{4})?$/.test(val)) {
    return 'Please enter a valid ZIP code'
  }
  return true
}

/**
 * Validates a US phone number format ((555) 123-4567)
 */
export const validatePhone = (val: string | null | undefined): true | string => {
  if (val && !/^\(\d{3}\) \d{3}-\d{4}$/.test(val)) {
    return 'Please use format: (555) 123-4567'
  }
  return true
}

/**
 * Validates a hex color format (# followed by 6 hexadecimal digits)
 */
export const validateHexColor = (val: string | null | undefined): true | string => {
  if (val && !/^#[0-9A-F]{6}$/i.test(val)) {
    return 'Please enter a valid hex color (e.g., #FF0000)'
  }
  return true
}

/**
 * Validates height format (6'2" or 6'2)
 */
export const validateHeight = (val: string | null | undefined): true | string => {
  if (val && !/^\d{1,2}'\d{1,2}"?$/.test(val)) {
    return "Please use format: 6'2\" or 6'2"
  }
  return true
}

/**
 * Validates minimum length for text fields
 */
export const validateMinLength = (minLength: number) => (val: string | null | undefined): true | string => {
  if (val && val.length < minLength) {
    return `Must be at least ${minLength} characters`
  }
  return true
}

/**
 * Validates maximum length for text fields
 */
export const validateMaxLength = (maxLength: number) => (val: string | null | undefined): true | string => {
  if (val && val.length > maxLength) {
    return `Must be ${maxLength} characters or less`
  }
  return true
}

/**
 * Validates that a value is within a numeric range
 */
export const validateRange = (min: number, max: number) => (val: number | null | undefined): true | string => {
  if (val !== null && val !== undefined && (val < min || val > max)) {
    return `Must be between ${min} and ${max}`
  }
  return true
}

/**
 * Validates that an array doesn't exceed maximum length
 */
export const validateMaxArrayLength = (maxLength: number) => (_value: unknown): true | string => {
  const value = Array.isArray(_value) ? _value : []
  if (value.length > maxLength) {
    return `Maximum ${maxLength} items allowed`
  }
  return true
}
