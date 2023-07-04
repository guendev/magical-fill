import { AllowField, ExcludedField } from './types'

export const onReady = (callback) => {
  if (document.readyState != 'loading') callback()
  else document.addEventListener('DOMContentLoaded', callback)
}

export const getAllFormData = (
  form: HTMLFormElement,
  allowFields: AllowField[] = [],
  excludedFields: AllowField[] = []
): Record<string, string> => {
  const formData = new FormData(form)
  const data: Record<string, string> = {}

  for (const [key, value] of formData.entries()) {
    console.log(key, value)
    // const field = form.elements[key]
    if (
      !isFieldAllowed(key, allowFields) ||
      isFieldExcluded(key, excludedFields)
      // (field && field.type === 'hidden')
    ) {
      continue
    }

    data[key] = value as string
  }

  return data
}

export const isFieldAllowed = (fieldName: string, allowFields: AllowField[]): boolean => {
  if (allowFields.length === 0) {
    return true
  }

  for (const allowField of allowFields) {
    if (allowField instanceof RegExp && allowField.test(fieldName)) {
      return true
    }

    if (typeof allowField === 'string' && allowField === fieldName) {
      return true
    }
  }

  return false
}

export const isFieldExcluded = (fieldName: string, excludedFields: ExcludedField[]): boolean => {
  for (const excludeField of excludedFields) {
    if (excludeField instanceof RegExp && excludeField.test(fieldName)) {
      return true
    }

    if (typeof excludeField === 'string' && excludeField === fieldName) {
      return true
    }
  }

  return false
}
