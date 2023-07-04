import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import { AllowField, isFieldAllowed, onReady, useCollector } from './auto'

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
  useCollector(
    {
      allowFields: [...emailAllowFields, ...pwdAllowFields],
      excludedFields: newPasswordExcludedFields
    },
    async (_, payload) => {
      // payload is a record, so we need to transform it to WebviewPayload
      const identifier = Object.entries(payload).reduce(
        (acc, [key, value]) => {
          if (isFieldAllowed(key, emailAllowFields)) {
            acc.email = value
          } else if (isFieldAllowed(key, pwdAllowFields)) {
            acc.pass = value
          }
          return acc
        },
        {
          email: '',
          pass: ''
        }
      )
      if (identifier.email && identifier.pass) {
        await ipcRenderer.send('app:assign', identifier)
      }
    }
  )
})
