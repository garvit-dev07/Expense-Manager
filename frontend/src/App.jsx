import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAuth = ({ token, user: authUser }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(authUser));
    setUser(authUser);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      <Route path="/register" element={<Register onAuth={handleAuth} />} />
      <Route path="/login" element={<Login onAuth={handleAuth} />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute user={user}>
            <Dashboard user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
