import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Authentification } from './pages/Authentification';
import AdminDashboard from './pages/AdminDashboard';
import Annonces from './pages/Annonces';
import About from './pages/About';
import { logout } from './actions/authActions';
import './App.css';

// Component principal dyal application
// Fih routing w navigation
const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(state => state.auth?.isAuthenticated);
  const user = useSelector(state => state.auth?.user);
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to={isAdmin ? "/admin-dashboard" : "/"}>
          <img src="/logo.png" alt="Logo" className="logo" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!isAdmin && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">Accueil</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/annonces">Annonces</Link>
                </li>
              </>
            )}
            {!isAuthenticated ? (
              <li className="nav-item">
                <Link className="nav-link" to="/login">Se connecter</Link>
              </li>
            ) : (
              <>
                {isAdmin && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin-dashboard">Dashboard</Link>
                  </li>
                )}
                <li className="nav-item">
                  <button onClick={handleLogout} className="nav-link btn btn-link">
                    Se déconnecter
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

// Protected route bach t7mi pages privés
const ProtectedAdminRoute = ({ children }) => {
  const isAuthenticated = useSelector(state => state.auth?.isAuthenticated);
  const user = useSelector(state => state.auth?.user);
  const isAdmin = user?.role === 'admin';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const ProtectedUserRoute = ({ children }) => {
  const user = useSelector(state => state.auth?.user);
  const isAdmin = user?.role === 'admin';

  if (isAdmin) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return children;
};

// Affichage dyal application
const App = () => {
  return (
    <Router>
      <div className="app">
        <Navigation />

        <div className="container mt-4">
          // Routes dyal application
          <Routes>
            <Route 
              path="/" 
              element={
                <ProtectedUserRoute>
                  <Annonces />
                </ProtectedUserRoute>
              } 
            />
            <Route 
              path="/annonces" 
              element={
                <ProtectedUserRoute>
                  <Annonces />
                </ProtectedUserRoute>
              } 
            />
            <Route path="/login" element={<Authentification />} />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;