import { getAllFormData } from './utils'
import { UseCollector } from './types'

// List of wForms
const wForms: string[] = []

export const useCollector: UseCollector = ({ allowFields = [], excludedFields = [] }, callback) => {
  // watch user interaction
  document.addEventListener('click', (event) => {
    // get target
    const target = event.target as HTMLElement
    // get form
    const form = target.closest('form')
    // if form
    if (form) {
      // form found
      const formId = form.getAttribute('w-form')
      if (formId) {
        return console.log('The form has been found', formId)
      }
      const newFormId = `w-form-${Math.random().toString(36)}`
      console.log('Add listener to form', newFormId)
      form.setAttribute('w-form', newFormId)
      wForms.push(newFormId)

      form.addEventListener('submit', (e) =>
        callback(e, getAllFormData(form, allowFields, excludedFields))
      )
    }
  })
}
