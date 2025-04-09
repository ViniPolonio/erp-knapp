import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login/login'
import Dashboard from './pages/Dashboard/Dashboard'
import Layout from './components/Layout'
import Register from './pages/Register/Register'

function App() {
  return (
    <Router>
      <Routes>
        {/* Página de login sem Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rota protegida com Layout */}
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
