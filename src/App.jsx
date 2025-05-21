import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Layout from './components/Layout/Layout'
import './index.css'
import Home from './pages/Home/Home'
import UsersApprove from './pages/UsersApprove/UsersApprove'
import AwaitingApprove from './pages/AwaitingApprove/AwaitingApprove'
import PrivateRoute from './components/Private/PrivateRoute'
import CompanyPage from './pages/Company'; 
import BranchPage from './pages/Branch'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/aguardando-aprovacao" element={<AwaitingApprove />} />
        
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/company" element={<CompanyPage />} />
            <Route path="/branch" element={<BranchPage />} />
            <Route path="/users-approve" element={<UsersApprove />} />
          </Route>
        </Route>

      </Routes>
    </Router>
  )
}

export default App