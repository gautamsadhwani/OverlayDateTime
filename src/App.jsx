import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Overlay from './Overlay'



function App() {
  const [count, setCount] = useState(0)
  
  return (
    <>
   <Overlay/>
    </>
  )
}

export default App
