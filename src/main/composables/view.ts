import { BrowserView, WebPreferences } from 'electron'

import { join } from 'path'

/**
 * Tạo view to web mục tiêu
 * B1: Tạo UserAgent
 * B2: Custom session
 * Todo: Fix secure context error
 */
export const useAppView = async () => {
  // Custom: session
  const sharedWebPreferences = useWebPrefs()

  const view: Electron.BrowserView = new BrowserView({
    webPreferences: sharedWebPreferences
  })

  view.setBackgroundColor('#FFFFFFFF')

  return view
}

const useWebPrefs = (): WebPreferences => {
  // ../preload/index.js
  const preload = join(__dirname, '../preload/index.js')

  return {
    spellcheck: false,
    nodeIntegration: false,
    contextIsolation: true,
    plugins: true,
    scrollBounce: true,
    preload
  }
}
