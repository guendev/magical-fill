import Versions from './components/Versions'
import icons from './assets/icons.svg'
import { AddWebView } from './components/AddWebView'

function App(): JSX.Element {
  return (
    <div className="container">
      <Versions></Versions>

      <svg className="hero-logo" viewBox="0 0 900 300">
        <use xlinkHref={`${icons}#electron`} />
      </svg>
      <h2 className="hero-text">Magical filling</h2>

      <AddWebView />
    </div>
  )
}

export default App
