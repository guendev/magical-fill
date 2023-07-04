import { AllowField, ExcludedField, UseFormInteraction } from './types'

/**
 * @description A function that will be called when the document is ready.
 */
export const onReady = (callback) => {
  if (document.readyState != 'loading') callback()
  else document.addEventListener('DOMContentLoaded', callback)
}

/**
 * Create a unique form id
 */
export const getFormId = (attr: string) => {
  return `${attr}-${Math.random().toString(36)}`
}

/**
 * @description a hook to interact when a form is interacted by user
 * Determine if the form is interacted by user
 */
export const useFormInteraction: UseFormInteraction = (callback, attr) => {
  // Add event listener
  document.addEventListener('click', (event) => {
    // get target
    const target = event.target as HTMLElement
    // get form
    const form = target.closest('form')
    // if form
    if (form) {
      // form found
      const formId = form.getAttribute(attr)
      if (formId) {
        console.log('The form has been found', formId)
      } else {
        const newFormId = getFormId(attr)
        console.log('Add listener to form', newFormId)
        form.setAttribute(attr, newFormId)
      }
      // call callback
      callback(form)
    }
  })
}

/**
 * @description get all form data
 * Get data from the form and return it as an object of needed data
 * TODO: support filling select, textarea, etc.
 */
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
    // if the current key is not allowed, skip it
    if (
      !isFieldAllowed(key, allowFields) ||
      isFieldExcluded(key, excludedFields)
      // (field && field.type === 'hidden')
    ) {
      continue
    }

    // add to data
    data[key] = value as string
  }

  return data
}

/**
 * @description check if the field is allowed
 */
export const isFieldAllowed = (fieldName: string, allowFields: AllowField[]): boolean => {
  // if allowFields is empty, allow all fields
  if (allowFields.length === 0) {
    return true
  }
  for (const allowField of allowFields) {
    // if allowField is a regex, test it
    if (allowField instanceof RegExp && allowField.test(fieldName)) {
      return true
    }

    // if allowField is a string, compare it
    if (typeof allowField === 'string' && allowField === fieldName) {
      return true
    }
  }

  return false
}

/**
 * @description check if the field is excluded
 */
export const isFieldExcluded = (fieldName: string, excludedFields: ExcludedField[]): boolean => {
  // if excludedFields is empty, allow all fields
  if (excludedFields.length === 0) {
    return false
  }

  for (const excludeField of excludedFields) {
    // if excludeField is a regex, test it
    if (excludeField instanceof RegExp && excludeField.test(fieldName)) {
      return true
    }

    // if excludeField is a string, compare it
    if (typeof excludeField === 'string' && excludeField === fieldName) {
      return true
    }
  }

  return false
}
