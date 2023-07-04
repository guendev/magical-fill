export const useAppBridge = () => {
  const mount = () => {
    // @ts-ignore
    return window.api.mount()
  }

  const openWebview = (url: string, payload?: Record<string, string>) => {
    // @ts-ignore
    return window.api.openWebview(url, payload)
  }

  const addEventListener = (event: string, callback: (...args: any[]) => void | Promise<void>) => {
    // @ts-ignore
    return window.api.addEventListener(event, callback)
  }

  return {
    mount,
    openWebview,
    addEventListener
  }
}
