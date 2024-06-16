import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Homepage from './Pages/Homepage'
import ChatsPage from './Pages/ChatsPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
    <Routes>
     <Route path="/" element={<Homepage/>}/>
     <Route path="/chats" element={<ChatsPage/>}/>
     </Routes>
    </div>
  )
}

export default App
