import "./App.css"
import BiblegramBoard from "./components/BiblegramBoard"
import BiblegramKeyboard from "./components/BiblegramKeyboard"
import BiblegramHeader from "./components/BiblegramHeader"
import { isMobile } from "./helpers"

function App() {
  return (
    <div className="App">
      <BiblegramHeader/>
      <BiblegramBoard/>
      {
        isMobile() ? <BiblegramKeyboard/> : ""
      }
    </div>
  )
}

export default App
