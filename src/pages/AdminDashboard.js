// Component dyal dashboard dyal admin
// Fih ga3 les annonces: pending, approved, w rejected
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  approveAnnouncement, 
  rejectAnnouncement, 
  loadAnnouncements, 
  deleteAnnouncement 
} from '../actions/announcementActions';
import './AdminDashboard.css';

const AdminDashboard = () => {
  // Njibo les annonces mlli component kayloada
  const dispatch = useDispatch();
  const announcements = useSelector(state => state?.announcements?.announcements || []);
  const user = useSelector(state => state?.auth?.user);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'approved', 'rejected'

  useEffect(() => {
    dispatch(loadAnnouncements());
  }, [dispatch]);

  // Filter dyal les annonces
  const filteredAnnouncements = announcements.filter(announcement => {
    switch (filter) {
      case 'pending':
        return announcement.status === 'pending';
      case 'approved':
        return announcement.status === 'approved';
      case 'rejected':
        return announcement.status === 'rejected';
      default:
        return true; // 'all'
    }
  });

  // Fonction bach tacccepti annonce
  const handleApprove = async (id) => {
    try {
      await dispatch(approveAnnouncement(id));
    } catch (error) {
      alert('Erreur lors de l\'approbation: ' + error.message);
    }
  };

  // Fonction bach trfed annonce
  const handleReject = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir rejeter cette annonce ?')) {
      try {
        await dispatch(rejectAnnouncement(id));
      } catch (error) {
        alert('Erreur lors du rejet: ' + error.message);
      }
    }
  };

  // Fonction bach tmseh annonce
  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      try {
        await dispatch(deleteAnnouncement(id));
      } catch (error) {
        alert('Erreur lors de la suppression: ' + error.message);
      }
    }
  };

  // Fonction bach tfilteri les annonces 7sab status
  const getStatusClass = (status) => {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Approuvée';
      case 'rejected':
        return 'Rejetée';
      default:
        return 'En attente';
    }
  };

  // Affichage dyal dashboard
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Tableau de bord Admin</h2>
        <p>Admin connecté: {user?.email}</p>
      </div>

      <div className="filter-buttons">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Toutes ({announcements.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          En attente ({announcements.filter(a => a.status === 'pending').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
          onClick={() => setFilter('approved')}
        >
          Approuvées ({announcements.filter(a => a.status === 'approved').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          Rejetées ({announcements.filter(a => a.status === 'rejected').length})
        </button>
      </div>

      <div className="announcements-list">
        <h3>Liste des annonces ({filteredAnnouncements.length})</h3>
        {filteredAnnouncements.length === 0 ? (
          <p className="no-announcements">Aucune annonce trouvée</p>
        ) : (
          filteredAnnouncements.map(announcement => (
            <div key={announcement.id} className="announcement-card">
              <div className="announcement-image">
                <img 
                  src={announcement.image || 'https://via.placeholder.com/300x200?text=Pas+d%27image'} 
                  alt={announcement.title}
                />
              </div>
              <div className="announcement-details">
                <h4>{announcement.title}</h4>
                <p>{announcement.description}</p>
                <p className="announcement-price">Prix: {announcement.price} DH</p>
                <p className="announcement-location">Localisation: {announcement.location}</p>
                <p className="announcement-info">Surface: {announcement.surface} m² | Pièces: {announcement.rooms}</p>
                <div className={`announcement-status ${getStatusClass(announcement.status)}`}>
                  {getStatusText(announcement.status)}
                </div>
                <div className="buttons">
                  {announcement.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleApprove(announcement.id)}
                        className="btn-approve"
                      >
                        Approuver
                      </button>
                      <button 
                        onClick={() => handleReject(announcement.id)}
                        className="btn-reject"
                      >
                        Rejeter
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => handleDelete(announcement.id)}
                    className="btn-delete"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;