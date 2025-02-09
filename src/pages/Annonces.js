import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSelector } from 'reselect';
import MapPicker from '../components/MapPicker';
import { addAnnouncement, loadAnnouncements } from '../actions/announcementActions';
import './Annonces.css';

// Component dyal les annonces
// Fih affichage w ajout dyal les annonces

// Create base selectors
const getAnnouncements = state => state?.announcements?.announcements || [];

// Create memoized selector using createSelector
const selectApprovedAnnouncements = createSelector(
  [getAnnouncements],
  (announcements) => announcements.filter(a => a.status === 'approved')
);

// Error Boundary Component
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
          <button onClick={toggleForm} className="btn btn-primary">
            {showForm ? 'Fermer' : 'Ajouter une annonce'}
          </button>
        </div>

        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="announcement-form">
            <div className="form-group">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Titre de l'annonce"
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                required
                className="form-control"
              />
            </div>
            <div className="form-row">
              <div className="form-group col">
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Prix (DH)"
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group col">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Localisation"
                  required
                  className="form-control"
                />
                <button 
                  type="button" 
                  onClick={() => setShowMap(true)}
                  className="btn btn-secondary mt-2"
                >
                  Sélectionner sur la carte
                </button>
                {selectedLocation && (
                  <small className="form-text text-success">
                    Position sélectionnée: {selectedLocation[0].toFixed(6)}, {selectedLocation[1].toFixed(6)}
                  </small>
                )}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col">
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="Location">Location</option>
                  <option value="Vente">Vente</option>
                </select>
              </div>
              <div className="form-group col">
                <input
                  type="number"
                  name="surface"
                  value={formData.surface}
                  onChange={handleChange}
                  placeholder="Surface (m²)"
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group col">
                <input
                  type="number"
                  name="rooms"
                  value={formData.rooms}
                  onChange={handleChange}
                  placeholder="Nombre de pièces"
                  required
                  className="form-control"
                />
              </div>
            </div>
            <div className="form-group">
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="URL de l'image"
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Publier l'annonce
            </button>
          </form>
        )}

        <div className="announcements-grid">
          {approvedAnnouncements.length === 0 ? (
            <h1 className="no-announcements">Aucune annonce disponible pour le moment</h1>
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
                      {announcement.location}
                      {announcement.coordinates && (
                        <button
                          className="btn btn-link view-map-link"
                          onClick={() => handleViewLocation(announcement.coordinates)}
                        >
                          <i className="fas fa-map-marker-alt"></i> Voir sur la carte
                        </button>
                      )}
                    </p>
                    <p className="specs">
                      {announcement.surface} m² • {announcement.rooms} pièces
                    </p>
                    <p className="type">{announcement.type}</p>
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
                className="close-map"
                onClick={() => setShowMap(false)}
              >
                ×
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
                className="close-map"
                onClick={() => setViewingLocation(null)}
              >
                ×
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