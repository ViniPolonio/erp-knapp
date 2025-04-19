import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Layout from './components/Layout/Layout'
import './index.css'
import Home from './pages/Home/Home'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App