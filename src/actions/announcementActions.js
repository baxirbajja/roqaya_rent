// Had les actions kaykhdmo 3la les annonces: izid, i3dl, imseh, w ishof les annonces
// Kol action 3ndha type dyalha w payload li kaywsl m3ah

// Action Types
export const ADD_ANNOUNCEMENT = 'ADD_ANNOUNCEMENT';
export const APPROVE_ANNOUNCEMENT = 'APPROVE_ANNOUNCEMENT';
export const REJECT_ANNOUNCEMENT = 'REJECT_ANNOUNCEMENT';
export const SET_ANNOUNCEMENTS = 'SET_ANNOUNCEMENTS';
export const DELETE_ANNOUNCEMENT = 'DELETE_ANNOUNCEMENT';

// Fonction li katjib les annonces mn localStorage
const getStoredAnnouncements = () => {
  try {
    return JSON.parse(localStorage.getItem('announcements')) || [];
  } catch (error) {
    console.error('Error reading announcements:', error);
    return [];
  }
};

// Fonction li katkhdem bach tsajil les annonces f localStorage
const saveAnnouncements = (announcements) => {
  try {
    localStorage.setItem('announcements', JSON.stringify(announcements));
  } catch (error) {
    console.error('Error saving announcements:', error);
  }
};

// Action bach tzid annonce jdida
// Katkhdem b async/await hit ghadi tsna localStorage
export const addAnnouncement = (announcement) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      try {
        const announcements = getStoredAnnouncements();
        
        // Add new announcement with pending status
        const newAnnouncement = {
          ...announcement,
          id: Date.now().toString(),
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        
        announcements.push(newAnnouncement);
        saveAnnouncements(announcements);
        
        dispatch({
          type: ADD_ANNOUNCEMENT,
          payload: newAnnouncement
        });
        
        resolve(newAnnouncement);
      } catch (error) {
        reject(error);
      }
    });
  };
};

// Action bach tacccepti annonce
export const approveAnnouncement = (announcementId) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      try {
        const announcements = getStoredAnnouncements();
        const index = announcements.findIndex(a => a.id === announcementId);
        
        if (index === -1) {
          reject(new Error('Annonce non trouvée'));
          return;
        }
        
        announcements[index] = {
          ...announcements[index],
          status: 'approved',
          approvedAt: new Date().toISOString()
        };
        
        saveAnnouncements(announcements);
        
        dispatch({
          type: APPROVE_ANNOUNCEMENT,
          payload: announcements[index]
        });
        
        resolve(announcements[index]);
      } catch (error) {
        reject(error);
      }
    });
  };
};

// Action bach trfed annonce
export const rejectAnnouncement = (announcementId) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      try {
        const announcements = getStoredAnnouncements();
        const index = announcements.findIndex(a => a.id === announcementId);
        
        if (index === -1) {
          reject(new Error('Annonce non trouvée'));
          return;
        }
        
        announcements[index] = {
          ...announcements[index],
          status: 'rejected',
          rejectedAt: new Date().toISOString()
        };
        
        saveAnnouncements(announcements);
        
        dispatch({
          type: REJECT_ANNOUNCEMENT,
          payload: announcements[index]
        });
        
        resolve(announcements[index]);
      } catch (error) {
        reject(error);
      }
    });
  };
};

// Action bach tmseh annonce
export const deleteAnnouncement = (id) => {
  return (dispatch, getState) => {
    try {
      const announcements = getState().announcements.announcements.filter(a => a.id !== id);
      localStorage.setItem('announcements', JSON.stringify(announcements));
      
      dispatch({
        type: DELETE_ANNOUNCEMENT,
        payload: id
      });
    } catch (error) {
      console.error('Error deleting announcement:', error);
      throw error;
    }
  };
};

// Action bach tjib ga3 les annonces
export const loadAnnouncements = () => {
  return (dispatch) => {
    const announcements = getStoredAnnouncements();
    dispatch({
      type: SET_ANNOUNCEMENTS,
      payload: announcements
    });
  };
};
