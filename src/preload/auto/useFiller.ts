import { FieldData, UseFiller } from './types'

// TODO: Fix this
export const fillToForm = (form: HTMLFormElement, resources: FieldData[]) => {
  form.querySelectorAll(`input`).forEach((field) => {
    const name = field.getAttribute('name')!
    const matched = resources.filter((f) => f[name])
    if (!matched.length) {
      return console.log('Not found field', name)
    }

    if (field.getAttribute('value')) {
      return console.log('Skip filled field', name)
    }
    const value = matched[0][name]
    // TODO: support filling select, textarea, etc.
    field.setAttribute('value', value)
    console.log('Fill field', name, value)
  })
}

/**
 * @description Fill form data automatically
 */
export const useFiller: UseFiller = async (getData) => {
  // get data from backend
  const resources = await getData()

  // fill forms when the current page is loaded
  document.querySelectorAll('form').forEach((form) => fillToForm(form, resources))

  // use MutationObserver to detect insert a new form to ducment
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Check if a new form was inserted
        const addedForm = Array.from(mutation.addedNodes).find((node) => node.nodeName === 'FORM')
        if (addedForm) {
          // fill the new form
          fillToForm(addedForm as HTMLFormElement, resources)
        }
      }
    }
  })
  const options = {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
  }
  observer.observe(document, options)
}
