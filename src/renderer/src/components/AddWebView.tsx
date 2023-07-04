import { useEffect, useState } from 'react'
import { useAppBridge } from '../hooks/useAppBridge'

export const AddWebView = (): JSX.Element => {
  const [url, setUrl] = useState<string>('https://www.facebook.com/')

  const api = useAppBridge()
  const openWebview = () => {
    if (!url) {
      return
    }
    api.openWebview(url)
  }

  const [payload, setPayload] = useState<any>(null)

  useEffect(() => {
    api.addEventListener('after:app:assign', (payload) => {
      setPayload(payload)
    })
  }, [])

  return (
    <div className={'grid grid-cols-2 gap-3'}>
      <form
        className={'space-y-4'}
        onSubmit={(e) => {
          e.preventDefault()
          openWebview()
        }}
      >
        <h1 className={'text-sm'}>Open Webview</h1>
        <input
          type={'text'}
          placeholder={'Enter an URL to test'}
          className={
            'px-2 py-2 focus:border-indigo-600 bg-transparent border-b-2 transition-all border-gray-500 outline-none bg-gray-700 text-sm block w-full'
          }
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <div>
          <button
            type={'submit'}
            className={'px-5 py-1.5 rounded-full shadow text-white bg-indigo-600 text-sm'}
          >
            Open
          </button>
        </div>
      </form>

      <div>{payload && JSON.stringify(payload)}</div>
    </div>
  )
}
