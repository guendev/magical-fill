import { getAllFormData, useFormInteraction } from './utils'
import { UseCollector } from './types'

export const useCollector: UseCollector = ({ allowFields = [], excludedFields = [] }, callback) => {
  useFormInteraction((form) => {
    form.addEventListener('submit', (e) =>
      callback(e, getAllFormData(form, allowFields, excludedFields))
    )
  }, 'w-form')
}
