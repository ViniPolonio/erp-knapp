import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login/login'
import Dashboard from './pages/Dashboard/Dashboard'
import Layout from './components/Layout'
import './index.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        
        <Route element={<Layout />}>
          <Route path="/home" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App