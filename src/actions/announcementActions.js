// Action Types
export const ADD_ANNOUNCEMENT = 'ADD_ANNOUNCEMENT';
export const APPROVE_ANNOUNCEMENT = 'APPROVE_ANNOUNCEMENT';
export const REJECT_ANNOUNCEMENT = 'REJECT_ANNOUNCEMENT';
export const SET_ANNOUNCEMENTS = 'SET_ANNOUNCEMENTS';
export const DELETE_ANNOUNCEMENT = 'DELETE_ANNOUNCEMENT';

// Helper function to get announcements from localStorage
const getStoredAnnouncements = () => {
  try {
    return JSON.parse(localStorage.getItem('announcements')) || [];
  } catch (error) {
    console.error('Error reading announcements:', error);
    return [];
  }
};

// Helper function to save announcements to localStorage
const saveAnnouncements = (announcements) => {
  try {
    localStorage.setItem('announcements', JSON.stringify(announcements));
  } catch (error) {
    console.error('Error saving announcements:', error);
  }
};

// Add new announcement
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

// Approve announcement
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

// Reject announcement
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

// Delete announcement
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

// Load all announcements
export const loadAnnouncements = () => {
  return (dispatch) => {
    const announcements = getStoredAnnouncements();
    dispatch({
      type: SET_ANNOUNCEMENTS,
      payload: announcements
    });
  };
};
