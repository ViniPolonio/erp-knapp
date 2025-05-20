// src/components/PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoute = () => {
  const user = JSON.parse(sessionStorage.getItem("user"))

  if (!user || user.status === 0) {
    return <Navigate to="/aguardando-aprovacao" replace />
  }

  return <Outlet />
}

export default PrivateRoute
