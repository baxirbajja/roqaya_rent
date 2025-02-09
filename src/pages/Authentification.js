import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, register } from '../actions/authActions';
import loca from '../Images/loca.jpg';
import '../authentification.css';

export function Authentification() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        // Login
        if (!formData.email || !formData.password) {
          setError('Veuillez remplir tous les champs');
          return;
        }

        await dispatch(login({
          email: formData.email,
          password: formData.password
        }));
      } else {
        // Register
        if (!formData.name || !formData.email || !formData.password) {
          setError('Veuillez remplir tous les champs');
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          return;
        }

        await dispatch(register({
          username: formData.name,
          email: formData.email,
          password: formData.password
        }));
      }

      navigate('/annonces');
    } catch (error) {
      setError(error.message || 'Une erreur est survenue');
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row justify-content-center align-items-center">
      <div className="p-2">
        <div className='d-flex justify-content-around'>
          <div className="d-inline-flex p-2">
            <img className="rounded float-left" src={loca} alt="Location illustration" />
          </div>
        </div>
      </div>
      <div className="form-box">
        <form className="form" onSubmit={handleSubmit}>
          <span className="title">{isLogin ? 'Se connecter' : 'S\'inscrire'}</span>
          <span className="subtitle">
            {isLogin 
              ? 'Connectez-vous à votre compte' 
              : 'Créez votre espace avec votre email'}
          </span>
          {error && <p className="text-danger">{error}</p>}
          <div className="form-container">
            {!isLogin && (
              <input 
                type="text" 
                className="input" 
                placeholder="Nom complet" 
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            )}
            <input 
              type="email" 
              className="input" 
              placeholder="Email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <input 
              type="password" 
              className="input" 
              placeholder="Mot de passe" 
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {!isLogin && (
              <input 
                type="password" 
                className="input" 
                placeholder="Confirmer le mot de passe" 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            )}
          </div>
          <button type="submit" className="btn btn-primary">
            {isLogin ? 'Se connecter' : 'S\'inscrire'}
          </button>
          <div className="form-section">
            <p>
              {isLogin 
                ? 'Vous n\'avez pas de compte ? ' 
                : 'Vous avez déjà un compte ? '}
              <button 
                type="button"
                className="btn btn-link p-0"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({
                    email: '',
                    password: '',
                    name: '',
                    confirmPassword: ''
                  });
                }}
              >
                {isLogin ? 'S\'inscrire' : 'Se connecter'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Authentification;