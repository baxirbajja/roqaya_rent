import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSelector } from 'reselect';
import MapPicker from '../components/MapPicker';
import { addAnnouncement, loadAnnouncements } from '../actions/announcementActions';
import './Annonces.css';

// Create base selectors
const getAnnouncements = state => state?.announcements?.announcements || [];

// Create memoized selector using createSelector
const selectApprovedAnnouncements = createSelector(
  [getAnnouncements],
  (announcements) => announcements.filter(a => a.status === 'approved')
);

// Error Boundary Component: A React component that catches and handles errors in its child components.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error in Annonces component:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Oops! Quelque chose s'est mal passé.</h2>
          <button 
            className="btn btn-primary"
            onClick={() => this.setState({ hasError: false })}
          >
            Réessayer
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const Annonces = () => {
  // State dyal form w modal
  const [showForm, setShowForm] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [viewingLocation, setViewingLocation] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    type: 'Location',
    surface: '',
    rooms: '',
    image: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Njibo les annonces mlli component kayloada
  const approvedAnnouncements = useSelector(selectApprovedAnnouncements);
  const isAuthenticated = useSelector(state => state.auth?.isAuthenticated);

  useEffect(() => {
    dispatch(loadAnnouncements());
  }, [dispatch]);

  // Fonction bach tpushi annonce jdida
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const announcementData = {
        ...formData,
        coordinates: selectedLocation ? selectedLocation : null
      };

      await dispatch(addAnnouncement(announcementData));
      
      setFormData({
        title: '',
        description: '',
        price: '',
        location: '',
        type: 'Location',
        surface: '',
        rooms: '',
        image: ''
      });
      setSelectedLocation(null);
      setShowForm(false);
      setShowMap(false);
      setSuccessMessage('Votre annonce a été soumise avec succès et est en attente d\'approbation.');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (error) {
      console.error('Error adding announcement:', error);
    }
  }, [dispatch, formData, selectedLocation, isAuthenticated, navigate]);

  // Fonction bach tchofi location f map
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Fonction bach tkhtar location mn map
  const handleLocationSelect = useCallback((location) => {
    setSelectedLocation(location);
    setShowMap(false);
  }, []);

  // Fonction bach tfermi form
  const handleViewLocation = useCallback((coordinates) => {
    if (coordinates) {
      setViewingLocation(coordinates);
    }
  }, []);

  const toggleForm = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowForm(!showForm);
  }, [showForm, isAuthenticated, navigate]);

  // Affichage dyal les annonces w form
  return (
    <ErrorBoundary>
      <div className="annonces-container">
        <div className="header-section">
          <h2>Annonces Immobilières</h2>
          <button 
            className="add-announcement-btn"
            onClick={toggleForm}
            title="Ajouter une annonce"
          >
            <i className="fas fa-plus"></i>
            <span>Ajouter une annonce</span>
          </button>
        </div>

        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        {showForm && (
          <div className="announcement-form">
            <h3 className="form-title">Ajouter une annonce</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Titre</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Prix (DH)</label>
                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select
                    name="type"
                    className="form-control"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="Location">Location</option>
                    <option value="Vente">Vente</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Surface (m²)</label>
                  <input
                    type="number"
                    name="surface"
                    className="form-control"
                    value={formData.surface}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nombre de pièces</label>
                  <input
                    type="number"
                    name="rooms"
                    className="form-control"
                    value={formData.rooms}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Localisation</label>
                <div className="location-input">
                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => setShowMap(true)}
                  >
                    <i className="fas fa-map-marker-alt"></i>
                    <span>Choisir sur la carte</span>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  name="image"
                  className="form-control"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Publier
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={toggleForm}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="announcements-grid">
          {approvedAnnouncements.length === 0 ? (
            <div className="no-announcements">
              <i className="fas fa-home" style={{ fontSize: '3rem', marginBottom: '1rem', color: '#bdc3c7' }}></i>
              <h3>Aucune annonce disponible pour le moment</h3>
              <p>Revenez plus tard pour voir les nouvelles annonces</p>
            </div>
          ) : (
            approvedAnnouncements.map(announcement => (
              <div key={announcement.id} className="announcement-card">
                <img 
                  src={announcement.image || 'https://via.placeholder.com/300x200?text=Pas+d%27image'} 
                  alt={announcement.title}
                  className="card-img-top"
                />
                <div className="card-body">
                  <h5 className="card-title">{announcement.title}</h5>
                  <p className="card-text">{announcement.description}</p>
                  <div className="announcement-details">
                    <p className="price">{announcement.price} DH</p>
                    <p className="location">
                      <i className="fas fa-map-marker-alt"></i>
                      {announcement.location}
                      {announcement.coordinates && (
                        <button
                          className="view-map-link"
                          onClick={() => handleViewLocation(announcement.coordinates)}
                        >
                          <i className="fas fa-map"></i>
                          Voir sur la carte
                        </button>
                      )}
                    </p>
                    <p className="specs">
                      <i className="fas fa-ruler-combined"></i> {announcement.surface} m² 
                      <span style={{ margin: '0 8px' }}>•</span>
                      <i className="fas fa-door-open"></i> {announcement.rooms} pièces
                    </p>
                    <p className="type">
                      <i className="fas fa-home"></i> {announcement.type}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {showMap && (
          <div className="map-modal">
            <div className="map-container">
              <button 
                className="map-close-btn"
                onClick={() => setShowMap(false)}
              >
                X
              </button>
              <MapPicker
                position={selectedLocation}
                setPosition={handleLocationSelect}
              />
            </div>
          </div>
        )}

        {viewingLocation && (
          <div className="map-modal">
            <div className="map-container">
              <button 
                className="map-close-btn"
                onClick={() => setViewingLocation(null)}
                title="Fermer"
              >
                X
              </button>
              <MapPicker
                position={viewingLocation}
                readonly={true}
              />
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Annonces;