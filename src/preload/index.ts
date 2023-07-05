import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import {
  AllowField,
  isFieldAllowed,
  isFieldExcluded,
  onReady,
  useCollector,
  useFormInteraction,
  useFiller
} from './auto'

export interface WebviewPayload {
  email: string
  pass: string
}

/**
 * IPC Renderer API
 */
export const api = {
  mount: () => ipcRenderer.invoke('app:mounted'),
  openWebview: (url: string, payload?: WebviewPayload) =>
    ipcRenderer.invoke('app:open', url, payload),
  addEventListener: (event: string, callback: (...args: any[]) => void | Promise<void>) =>
    ipcRenderer.on(event, (_, data) => callback(data))
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

/**
 * Auto fill
 */
const emailAllowFields: AllowField[] = [
  /^user(name)?$/i,
  /^email$/i,
  /^nickname$/i,
  /^identifier$/i
]

const pwdAllowFields: AllowField[] = [/^password$/i, /^pass(word)?$/i, /^pwd$/i, /^Passwd$/i]

const newPasswordExcludedFields: AllowField[] = [/^newPassword$/i]

onReady(() => {
  // Auto collect form
  useCollector(
    {
      allowFields: [...emailAllowFields, ...pwdAllowFields],
      excludedFields: newPasswordExcludedFields
    },
    async (_, payload) => {
      if (!Object.keys(payload).length) {
        console.log('No payload found')
        return
      }
      // Tranform payload to { email, pass }
      await ipcRenderer.send('app:assign', payload)
    }
  )

  // Autofill form
  useFiller(
    () => [
      {
        email: 'dnstylish',
        pass: 'Khangancut'
      },
      {
        email: 'guendev',
        pass: 'Khangancut'
      },
      {
        email: 'khangancut',
        pass: 'Khangancut'
      },
      {
        address: 'Vietnam',
        city: 'Hanoi'
      }
    ],
    (form, resources) => {
      // query all input fields to an array
      const inputs = Array.from(form.querySelectorAll('input'))
      const emailInput = inputs.find((input) => isFieldAllowed(input.name, emailAllowFields))
      const pwdInput = inputs.find(
        (input) =>
          isFieldAllowed(input.name, pwdAllowFields) &&
          !isFieldExcluded(input.name, newPasswordExcludedFields)
      )

      if (!emailInput || !pwdInput) {
        console.log('No email or password field found')
        return
      }

      // autofill the first email and password
      emailInput.value = resources[0].email
      pwdInput.value = resources[0].pass
    }
  )

  // custom select
  useFormInteraction((form) => {
    console.log('Form interaction', form)
  }, 'c-form')
})
