import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../actions/authActions';
import loca from '../Images/loca.jpg';
import '../authentification.css';

// Component dyal login
// Kaykhdm bach user iconnecta l compte dyalo
const Login = () => {
  // hado hooks li ghadi n7tajo bach nconnectiw
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State dyal form
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  // Fonction katexecuta mlli user kaybedel chi input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Fonction li katkhdem m3a submit dyal form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // kansifto credentials l backend o kantsennaw response
      const response = await dispatch(login(formData.email, formData.password));
      
      // Redirection ila user connecté
      if (response && response.isAdmin) {
        navigate('/admin-dashboard');
      } else {
        navigate('/annonces');
      }
    } catch (error) {
      // ila kan chi error kanaffichiwh
      setError(error.message || 'Une erreur est survenue lors de la connexion');
    }
  };

  // Affichage dyal form
  return (
    <div className='d-flex justify-content-around'>
      <div className="d-inline-flex p-2">
        <img className="rounded float-left" src={loca} alt="Location illustration" />
      </div>
      <div className="form-box">
        <form className="form" onSubmit={handleSubmit}>
          <span className="title">Se connecter</span>
          <span className="subtitle">Bienvenue! Veulliez vous connectez à votre espace.</span>
          {error && <p className="text-danger">{error}</p>}
          <div className="form-container">
            <input
              type="email"
              className="input"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              className="input"
              placeholder="Mot de passe"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Se connecter</button>
        </form>
        <div className="form-section">
          <p>Vous n'avez pas de compte? <a href="/">s'inscrire</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
