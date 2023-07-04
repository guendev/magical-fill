import { getAllFormData, useFormInteraction } from './utils'
import { UseCollector } from './types'

/**
 * @description Collect form data
 * Use useFormInteraction to only one event listener for interacted forms
 * You can tranform the data to your backedn by callback
 */
export const useCollector: UseCollector = ({ allowFields = [], excludedFields = [] }, callback) => {
  useFormInteraction((form) => {
    form.addEventListener('submit', (e) =>
      callback(e, getAllFormData(form, allowFields, excludedFields))
    )
  }, 'w-form')
}
