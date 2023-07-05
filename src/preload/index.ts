import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import { AllowField, onReady, useCollector } from './auto'
import { useFiller } from './auto/useFiller'

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
      await ipcRenderer.send('app:assign', payload)
    }
  )
  useFiller(() => [
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
  ])
})
