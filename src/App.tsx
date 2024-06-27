import "./App.css"
import BiblegramBoard from "./components/BiblegramBoard"
import BiblegramKeyboard from "./components/BiblegramKeyboard"
import { isMobile } from "./helpers"

function App() {
  return (
    <div className="App">
      <nav>
        <h1>Biblegram</h1>
      </nav>
      <BiblegramBoard/>
      {
        isMobile() ? <BiblegramKeyboard/> : ""
      }
    </div>
  )
}

export default App
